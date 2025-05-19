-- Enable required extensions
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "http" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- Create custom types
create type user_role as enum ('student', 'instructor', 'admin');
create type enrollment_status as enum ('active', 'completed', 'dropped');
create type feedback_status as enum ('draft', 'submitted', 'approved', 'rejected');

-- Create tables
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role user_role not null default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(first_name) >= 1 and char_length(last_name) >= 1)
);

create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  name text not null,
  description text,
  credits integer not null default 3,
  instructor_id uuid references public.profiles(id) on delete set null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint credits_positive check (credits > 0)
);

create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status enrollment_status default 'active',
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  constraint unique_enrollment unique(student_id, course_id)
);

create table public.feedback_forms (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  is_active boolean default true,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint end_date_after_start_date check (end_date > start_date)
);

create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  feedback_form_id uuid references public.feedback_forms(id) on delete cascade not null,
  question_text text not null,
  question_type text not null, -- 'multiple_choice', 'text', 'rating', etc.
  is_required boolean default true,
  options jsonb, -- For multiple choice options
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  feedback_form_id uuid references public.feedback_forms(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  status feedback_status default 'draft',
  submitted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_submission unique(feedback_form_id, student_id)
);

create table public.answers (
  id uuid default uuid_generate_v4() primary key,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  answer_text text,
  answer_rating integer,
  answer_choice text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_answer_per_question unique(submission_id, question_id),
  constraint valid_rating check (answer_rating is null or (answer_rating >= 1 and answer_rating <= 5))
);

-- Create indexes for better query performance
create index idx_enrollments_student_id on public.enrollments(student_id);
create index idx_enrollments_course_id on public.enrollments(course_id);
create index idx_feedback_forms_course_id on public.feedback_forms(course_id);
create index idx_questions_feedback_form_id on public.questions(feedback_form_id);
create index idx_submissions_feedback_form_id on public.submissions(feedback_form_id);
create index idx_submissions_student_id on public.submissions(student_id);
create index idx_answers_submission_id on public.answers(submission_id);
create index idx_answers_question_id on public.answers(question_id);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.feedback_forms enable row level security;
alter table public.questions enable row level security;
alter table public.submissions enable row level security;
alter table public.answers enable row level security;

-- Create RLS policies
-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Courses policies
create policy "Users can view all courses"
  on public.courses for select
  using (true);

create policy "Instructors can manage their courses"
  on public.courses for all
  using (auth.uid() = instructor_id);

create policy "Admins can manage all courses"
  on public.courses for all
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  ));

-- Enrollments policies
create policy "Users can view their own enrollments"
  on public.enrollments for select
  using (auth.uid() = student_id);

create policy "Instructors can view enrollments for their courses"
  on public.enrollments for select
  using (exists (
    select 1 from public.courses 
    where id = course_id and instructor_id = auth.uid()
  ));

create policy "Students can enroll in courses"
  on public.enrollments for insert
  with check (auth.uid() = student_id);

-- Feedback forms policies
create policy "Users can view active feedback forms for their courses"
  on public.feedback_forms for select
  using (
    is_active = true and 
    (exists (
      select 1 from public.enrollments 
      where student_id = auth.uid() and course_id = feedback_forms.course_id
    ) or 
    exists (
      select 1 from public.courses 
      where id = feedback_forms.course_id and instructor_id = auth.uid()
    ))
  );

create policy "Instructors can manage feedback forms for their courses"
  on public.feedback_forms for all
  using (exists (
    select 1 from public.courses 
    where id = feedback_forms.course_id and instructor_id = auth.uid()
  ));

-- Submissions policies
create policy "Students can view and manage their own submissions"
  on public.submissions for all
  using (auth.uid() = student_id);

create policy "Instructors can view submissions for their courses"
  on public.submissions for select
  using (exists (
    select 1 from public.feedback_forms ff
    join public.courses c on ff.course_id = c.id
    where ff.id = submissions.feedback_form_id and c.instructor_id = auth.uid()
  ));

-- Answers policies
create policy "Users can view answers for their submissions"
  on public.answers for select
  using (exists (
    select 1 from public.submissions 
    where id = answers.submission_id and student_id = auth.uid()
  ));

create policy "Instructors can view answers for their courses"
  on public.answers for select
  using (exists (
    select 1 from public.submissions s
    join public.feedback_forms ff on s.feedback_form_id = ff.id
    join public.courses c on ff.course_id = c.id
    where s.id = answers.submission_id and c.instructor_id = auth.uid()
  ));

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id, 
    new.email,
    split_part(new.raw_user_meta_data->>'full_name', ' ', 1),
    split_part(new.raw_user_meta_data->>'full_name', ' ', 2),
    'student'::user_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to handle new user signups
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a function to get user role
create or replace function public.get_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer;

-- Create a function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Create a function to check if user is instructor
create or replace function public.is_instructor()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'instructor'
  );
$$ language sql security definer;

-- Create a function to check if user is student
create or replace function public.is_student()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'student'
  );
$$ language sql security definer;

-- Create a function to get user's enrolled courses
create or replace function public.get_enrolled_courses()
returns table (
  course_id uuid,
  code text,
  name text,
  description text,
  credits integer,
  status enrollment_status,
  enrolled_at timestamp with time zone
) as $$
  select 
    c.id as course_id,
    c.code,
    c.name,
    c.description,
    c.credits,
    e.status,
    e.enrolled_at
  from public.courses c
  join public.enrollments e on c.id = e.course_id
  where e.student_id = auth.uid();
$$ language sql security definer;

-- Create a function to get feedback forms for a student
create or replace function public.get_student_feedback_forms()
returns table (
  form_id uuid,
  course_id uuid,
  course_code text,
  course_name text,
  title text,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  submission_status feedback_status,
  submitted_at timestamp with time zone
) as $$
  select 
    ff.id as form_id,
    c.id as course_id,
    c.code as course_code,
    c.name as course_name,
    ff.title,
    ff.description,
    ff.start_date,
    ff.end_date,
    coalesce(s.status, 'draft'::feedback_status) as submission_status,
    s.submitted_at
  from public.courses c
  join public.enrollments e on c.id = e.course_id
  join public.feedback_forms ff on c.id = ff.course_id
  left join public.submissions s on s.feedback_form_id = ff.id and s.student_id = auth.uid()
  where e.student_id = auth.uid()
  and ff.is_active = true
  and ff.start_date <= now()
  and ff.end_date >= now()
  and (s.id is null or s.status != 'submitted');
$$ language sql security definer;

-- Create a function to get feedback statistics for instructors
create or replace function public.get_feedback_statistics(p_course_id uuid)
returns table (
  form_id uuid,
  form_title text,
  question_id uuid,
  question_text text,
  average_rating numeric,
  total_submissions integer
) as $$
  select 
    q.feedback_form_id as form_id,
    ff.title as form_title,
    q.id as question_id,
    q.question_text,
    avg(a.answer_rating) as average_rating,
    count(distinct s.id) as total_submissions
  from public.questions q
  join public.feedback_forms ff on q.feedback_form_id = ff.id
  left join public.submissions s on s.feedback_form_id = ff.id
  left join public.answers a on a.submission_id = s.id and a.question_id = q.id
  where ff.course_id = p_course_id
  and q.question_type = 'rating'
  and s.status = 'submitted'
  group by q.feedback_form_id, ff.title, q.id, q.question_text
  order by q.feedback_form_id, q.id;
$$ language sql security definer;

-- Set up storage for file uploads (avatars, etc.)
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up storage policies for avatars
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() = (storage.foldername(name))[1]::uuid);

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid() = (storage.foldername(name))[1]::uuid);

-- Create a function to get a download URL for a file
create or replace function public.get_file_url(bucket_name text, file_path text)
returns text as $$
  select concat(
    (select setting from pg_settings where name = 'app.settings.storage_url'),
    '/storage/v1/object/public/',
    bucket_name,
    '/',
    file_path
  );
$$ language sql security definer;
