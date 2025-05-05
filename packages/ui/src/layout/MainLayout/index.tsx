import React from 'react';

interface MainLayoutProps {
    header: React.ReactNode;
    sidebar: React.ReactNode;
    children: React.ReactNode;
    pageTitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    header,
    sidebar,
    children,
    pageTitle = "SIMULADO GARANTIA"
}) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            {sidebar}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                {header}

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
                        <div className="flex items-center">
                            <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Main content container */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-180px)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
