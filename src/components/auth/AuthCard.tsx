import React, { forwardRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(
  ({ children, title, description, icon, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'border border-[#E8EAED] bg-white shadow-lg relative overflow-hidden',
          className,
        )}
      >
        {/* Card Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F0FE]/30 via-transparent to-[#E8F0FE]/30" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4285F4]/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#34A853]/5 rounded-full blur-2xl" />

        <CardHeader className="relative z-10 pb-4">
          <CardTitle className="text-2xl font-bold text-[#202124] flex items-center gap-3 font-heading">
            {icon}
            {title}
          </CardTitle>
          <CardDescription className="text-[#5F6368] font-sans">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          {children}
        </CardContent>
      </Card>
    );
  },
);

AuthCard.displayName = 'AuthCard';

export default AuthCard;
