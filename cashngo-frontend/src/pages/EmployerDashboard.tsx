import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Our Custom & Layout Components ---
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AnimatedSection from '@/components/AnimatedSection';

// --- shadcn/ui Component Imports ---
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// --- Icon Imports ---
import { Briefcase, CircleDollarSign, Users, PlusCircle } from 'lucide-react';

// --- Mock Data for Charts and Table ---
const spendingData = [
    { name: 'Data', spent: 450 }, { name: 'Design', spent: 300 }, { name: 'Writing', spent: 300 },
    { name: 'Dev', spent: 200 }, { name: 'Marketing', spent: 278 }, { name: 'Admin', spent: 189 },
];
const activeGigs = [
    { title: 'Advanced Financial Modeling', applicants: 3, budget: '$50.00', status: 'Open' },
    { title: 'AI Prompt Engineering', applicants: 1, budget: '$40.00', status: 'Open' },
    { title: 'Social Media Copywriting', applicants: 8, budget: '$25.50', status: 'Reviewing' },
    { title: 'Brand Logo Design', applicants: 0, budget: '$150.00', status: 'Draft' },
];

const EmployerDashboard: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <AnimatedSection>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Employer Overview</h1>
                        <Button className="bg-green-500 hover:bg-green-600 text-white dark:text-slate-900 font-bold transition-transform hover:scale-105">
                            <PlusCircle className="mr-2 h-5 w-5" /> Post a New Gig
                        </Button>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatedSection delay="delay-100">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Gigs</CardTitle>
                                <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">+1 from yesterday</p>
                            </CardContent>
                        </Card>
                    </AnimatedSection>
                    <AnimatedSection delay="delay-200">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applicants</CardTitle>
                                <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">3 pending review</p>
                            </CardContent>
                        </Card>
                    </AnimatedSection>
                    <AnimatedSection delay="delay-300">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</CardTitle>
                                <CircleDollarSign className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$450.00</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">This month</p>
                            </CardContent>
                        </Card>
                    </AnimatedSection>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <AnimatedSection delay="delay-100" className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Gigs</CardTitle>
                                <CardDescription>An overview of your currently posted jobs.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Gig Title</TableHead>
                                            <TableHead className="text-center">Applicants</TableHead>
                                            <TableHead className="text-center">Budget</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeGigs.map((gig) => (
                                            <TableRow key={gig.title} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{gig.title}</TableCell>
                                                <TableCell className="text-center">{gig.applicants}</TableCell>
                                                <TableCell className="text-center">{gig.budget}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={
                                                        gig.status === 'Reviewing' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                        gig.status === 'Open' ? 'bg-green-500 hover:bg-green-600' :
                                                        'bg-slate-500 hover:bg-slate-600'
                                                    }>{gig.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </AnimatedSection>
                    <AnimatedSection delay="delay-200" className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Spending by Category</CardTitle>
                                <CardDescription>How your budget is allocated across skill types.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={spendingData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                                        <Bar dataKey="spent" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </AnimatedSection>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployerDashboard;