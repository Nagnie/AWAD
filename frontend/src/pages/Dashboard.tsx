import React from 'react'
import { Badge } from '@/components/ui/badge.tsx'
const Dashboard: React.FC = () => {

    return (
        <div className="max-w-screen p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className={"font-bold text-4xl"}>Dashboard</h1>
                <Badge variant="outline" className="text-sm">
                    Last updated: {new Date().toLocaleString('vi-VN')}
                </Badge>
            </div>
        </div>
    )
}

export default Dashboard