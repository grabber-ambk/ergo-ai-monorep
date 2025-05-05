'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface UserProfileMenuProps {
    userName?: string;
    userRole?: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
                                                                    userName = "Convidado",
                                                                    userRole = "Usuário Web"
                                                                }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center">
                {userName?.charAt(0) || 'M'}
            </div>
            <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-gray-500">{userRole}</div>
            </div>
            {isMounted ? (
                <ChevronDown size={14} className="ml-1 text-gray-400" />
            ) : (
                <div className="w-[14px] h-[14px] ml-1 text-gray-400"></div>
            )}
        </div>
    );
};

export default UserProfileMenu;
