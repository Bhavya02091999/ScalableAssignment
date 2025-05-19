"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from "@/hooks/use-auth"
import { useUpdateProfile } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function SettingsPage() {
  const { user } = useUser()
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateProfile.mutateAsync({
        name: data.name,
        email: data.email,
      })
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-2">
        Manage your account settings and preferences
      </p>

      <Tabs defaultValue="profile" className="mt-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="max-w-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update profile
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Delete account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and all of its contents from our
                servers. This action is not reversible, so please continue with
                caution.
              </p>
              <Button
                variant="destructive"
                className="mt-4"
                disabled
                // onClick={handleDeleteAccount}
              >
                Delete account
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Change password</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your password associated with your account.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Change password
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
