import React from "react";

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">
                    Memuat data portfolio...
                </p>
            </div>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 text-center w-full">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
