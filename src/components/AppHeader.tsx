
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  showLogoutButton = true
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-faircut/20 bg-faircut-accent/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-faircut-text hover:bg-faircut-dark/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="sr-only">Go back</span>
            </Button>
          )}
          
          {!title && <Logo size="small" />}
          
          {title && (
            <h1 className="text-lg font-semibold tracking-wider text-faircut-text">
              {title}
            </h1>
          )}
        </div>

        {showLogoutButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-faircut-text hover:bg-faircut-dark/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 mr-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
