import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, GraduationCap, Building2 } from 'lucide-react';

export default function SignupChooser() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Join Breslov Academy</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Choose the best way to start your journey into the Torah of Rebbe Nachman.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Student Signup */}
        <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <User className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl">I'm a Student</CardTitle>
            <CardDescription className="pt-2">Join an existing school to access courses and community.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pb-8">
            <Button asChild className="w-full py-6 text-lg font-semibold">
              <Link to="/signup/student">Join as Student</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Teacher Signup */}
        <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <GraduationCap className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl">I'm a Teacher</CardTitle>
            <CardDescription className="pt-2">Teach courses and share wisdom with your students.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pb-8">
            <Button asChild variant="outline" className="w-full py-6 text-lg font-semibold border-2">
              <Link to="/signup/teacher">Join as Teacher</Link>
            </Button>
          </CardContent>
        </Card>

        {/* School Signup */}
        <Card className="flex flex-col h-full border-2 border-primary hover:border-primary/80 transition-colors shadow-md relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            Recommended for Schools
          </div>
          <CardHeader className="text-center pt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
              <Building2 className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl">New School</CardTitle>
            <CardDescription className="pt-2">Create a dedicated white-label platform for your organization.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pb-8">
            <Button asChild className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/signup/school">Start a School</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-500">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
