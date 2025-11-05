import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Languages, LogOut, User, History, FileText, Image, Video } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
export const Navbar = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IMT
          </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? <>
                <Button variant={isActive('/translate') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/translate')} className="hidden md:flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Text
                </Button>
                <Button variant={isActive('/image-translate') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/image-translate')} className="hidden md:flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Image
                </Button>
                <Button variant={isActive('/video-translate') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/video-translate')} className="hidden md:flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </Button>
                <Button variant={isActive('/history') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/history')} className="hidden md:flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/translate')} className="md:hidden">
                      <FileText className="h-4 w-4 mr-2" />
                      Text Translation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/image-translate')} className="md:hidden">
                      <Image className="h-4 w-4 mr-2" />
                      Image Translation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/video-translate')} className="md:hidden">
                      <Video className="h-4 w-4 mr-2" />
                      Video Translation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/history')} className="md:hidden">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="md:hidden" />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </> : <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>}
          </div>
        </div>
      </div>
    </nav>;
};