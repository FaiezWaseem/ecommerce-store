
import AdminNav from "@/components/navbar/admin-nav"
import { Card, CardHeader, CardBody } from "@nextui-org/react"
import { Overview } from "@/components/graph";
import { AiFillDollarCircle } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { FiPackage } from "react-icons/fi";

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export default function AdminHome() {
    return <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Dashboard" />
        <main className="p-4">


            <div className="p-4">
                <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome to the admin dashboard</p>
                <hr className="mt-3" />
            </div>
            <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-3 grid-cols-1 p-4">
                <Card shadow="sm" radius="sm" className="border border-gray-200 dark:bg-transparent hover:border-primary-300 hover:cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <AiFillDollarCircle className="h-4 w-4 text-muted-foreground" />
                        {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    </CardHeader>
                    <CardBody>
                        <div className="text-2xl font-bold">$28</div>
                    </CardBody>
                </Card>
                <Card shadow="sm" radius="sm" className="border border-gray-200 dark:bg-transparent hover:border-primary-300 hover:cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <CiCreditCard1 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardBody>
                        <div className="text-2xl font-bold">+{29}</div>
                    </CardBody>
                </Card>
                <Card shadow="sm" radius="sm" className="border border-gray-200 dark:bg-transparent hover:border-primary-300 hover:cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
                        <FiPackage className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardBody>
                        <div className="text-2xl font-bold">{20}</div>
                    </CardBody>
                </Card>
            </div>
            <div className="flex flex-col md:flex-row gap-4 p-4 justify-center">
                <Transactions />
                <Card className="col-span-4 m-4 dark:bg-transparent border flex-1" shadow="sm" radius="sm">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardBody className="pl-2">
                        <Overview data={[{ name: 'Jan', value: 1599 }, { name: 'Feb', value: 1230 }, { name: 'Mar', value: 987, }, { name: 'Apr', value: 1800 }, { name: 'May', value: 200 }, { name: 'Jun', value: 1200 }, { name: 'Jul', value: 931 }, { name: 'Aug', value: 1367 }]} />
                    </CardBody>
                </Card>
            </div>
        </main>
    </div>
}


interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const CardTitle = ({ children, className }: CardProps) => {
    return <p className={`text-md font-medium ${className ?? ''}`}>{children}</p>
}



function Transactions() {
    return (
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                        Recent transactions from your store.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden xl:table-column">Type</TableHead>
                            <TableHead className="hidden xl:table-column">Status</TableHead>
                            <TableHead className="hidden xl:table-column">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Liam Johnson</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    liam@example.com
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">Sale</TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-23
                            </TableCell>
                            <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Olivia Smith</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    olivia@example.com
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">Refund</TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Declined
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-24
                            </TableCell>
                            <TableCell className="text-right">$150.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Noah Williams</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    noah@example.com
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                Subscription
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-25
                            </TableCell>
                            <TableCell className="text-right">$350.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Emma Brown</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    emma@example.com
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">Sale</TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-26
                            </TableCell>
                            <TableCell className="text-right">$450.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Liam Johnson</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    liam@example.com
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">Sale</TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-27
                            </TableCell>
                            <TableCell className="text-right">$550.00</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
