"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Send, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useGetUserProfile } from '@/utils/hooks/user';

const ProtectedPage: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const { data: userProfile,isLoading } = useGetUserProfile();
    if (isLoading) {
        return (

        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[80vw] max-w-[80vw] h-[100vh] flex flex-col justify-center items-center">
                <CardHeader>
                    <CardTitle><Skeleton className="h-6 w-[200px]"/></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <Skeleton className="h-4 w-[300px] mb-2" />
                    <Skeleton className="h-4 w-[250px] mb-2" />
                    <Skeleton className="h-4 w-[280px]" />
                </CardContent>
            </Card>
            </div>


        );
    }

    return (
        <div className="flex flex-col h-screen p-4 overflow-x-hidden">
            <SidebarInset>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/protected">Protected Page</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </SidebarInset>

        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[85vw] max-w-[85vw] h-[92vh] flex flex-col p-6">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Welcome  {userProfile?.full_name} to ResQ AI</CardTitle>
                    <CardDescription>An intelligent emergency response system.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
                        <p className="text-sm text-muted-foreground">
                            To revolutionize emergency response by providing AI-powered assistance, ensuring every call is handled efficiently and effectively.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                        <div className="space-y-2">
                            <Badge variant="outline">AI-Powered Call Prioritization</Badge>
                            <Badge variant="outline">Emotion Detection</Badge>
                            <Badge variant="outline">Real-Time Location Tracking</Badge>
                            <Badge variant="outline">Automated Action Recommendations</Badge>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                        <ScrollArea className="h-[150px]">
                            <p className="text-sm text-muted-foreground">
                                ResQ AI aggregates emergency calls, analyzes caller emotions, and prioritizes based on severity. It provides dispatchers with real-time insights and action recommendations.
                            </p>
                        </ScrollArea>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                        <Button variant="outline" onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/');
                        }}>Sign Out</Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="secondary">Learn More <ChevronRightIcon className="ml-2 h-4 w-4" /></Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>About ResQ AI</SheetTitle>
                                    <SheetDescription>
                                        More detailed information about our product.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <p>ResQ AI is designed to...</p>
                                    <p>Our technology includes...</p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </CardContent>
            </Card>
        </div>
        </div>
    );
};

export default ProtectedPage;