import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>
          Enter your email below to log in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" asChild>
            <Link href="/">Log in</Link>
        </Button>
        <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary">
                Sign up
            </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
