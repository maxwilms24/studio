import { AppLayout } from '@/components/app-layout';
import { SportIcon } from '@/components/icons/sport-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockUsers } from '@/lib/data';

export default function ProfilePage() {
  const user = mockUsers[0]; // Mocking the current user

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.profilePhoto.imageUrl} alt={user.name} data-ai-hint={user.profilePhoto.imageHint} />
            <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{user.name}</h1>
            <p className="text-muted-foreground mt-1">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
        <Separator />
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Favorite Sports</CardTitle>
                <CardDescription>The sports you love to play the most.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {user.favoriteSports.map(sport => (
                        <Badge key={sport} variant="secondary" className="text-lg py-2 px-4 border border-border flex items-center gap-2">
                            <SportIcon sport={sport} className="h-5 w-5" />
                            <span>{sport}</span>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
