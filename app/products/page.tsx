"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// Extended product data
const products = [
  {
    id: 1,
    name: "Easy Access Saver",
    provider: "Barclays",
    type: "Savings Account",
    rateType: "Variable",
    rate: 4.25,
    minDeposit: 1,
    maxDeposit: 1000000,
    term: "None",
    access: "Instant",
    protection: "FSCS",
    tags: ["Savings Account", "Variable"],
  },
  {
    id: 2,
    name: "2 Year Fixed Rate ISA",
    provider: "Nationwide",
    type: "Cash ISA",
    rateType: "Fixed",
    rate: 5.15,
    minDeposit: 1000,
    maxDeposit: 20000,
    term: "2 years",
    access: "Fixed Term",
    protection: "FSCS",
    tags: ["Cash ISA", "Fixed"],
  },
  {
    id: 3,
    name: "UK Government Gilt 2028",
    provider: "UK Treasury",
    type: "Gilt",
    rateType: "Fixed",
    rate: 4.85,
    minDeposit: 100,
    maxDeposit: null,
    term: "5 years",
    access: "Secondary Market",
    protection: "Government Backed",
    tags: ["GILT", "Fixed"],
  },
  {
    id: 4,
    name: "Premium Saver",
    provider: "HSBC",
    type: "Savings Account",
    rateType: "Variable",
    rate: 4.5,
    minDeposit: 1,
    maxDeposit: 500000,
    term: "None",
    access: "Instant",
    protection: "FSCS",
    tags: ["Savings Account", "Variable"],
  },
  {
    id: 5,
    name: "1 Year Fixed Rate Bond",
    provider: "Atom Bank",
    type: "Savings Account",
    rateType: "Fixed",
    rate: 5.3,
    minDeposit: 500,
    maxDeposit: 100000,
    term: "1 year",
    access: "Fixed Term",
    protection: "FSCS",
    tags: ["Savings Account", "Fixed"],
  },
  {
    id: 6,
    name: "Flexible Cash ISA",
    provider: "Halifax",
    type: "Cash ISA",
    rateType: "Variable",
    rate: 4.4,
    minDeposit: 1,
    maxDeposit: 20000,
    term: "None",
    access: "Instant",
    protection: "FSCS",
    tags: ["Cash ISA", "Variable"],
  },
  {
    id: 7,
    name: "UK Government Gilt 2025",
    provider: "UK Treasury",
    type: "Gilt",
    rateType: "Fixed",
    rate: 4.65,
    minDeposit: 100,
    maxDeposit: null,
    term: "2 years",
    access: "Secondary Market",
    protection: "Government Backed",
    tags: ["GILT", "Fixed"],
  },
  {
    id: 8,
    name: "3 Year Fixed Rate ISA",
    provider: "Santander",
    type: "Cash ISA",
    rateType: "Fixed",
    rate: 5.25,
    minDeposit: 500,
    maxDeposit: 20000,
    term: "3 years",
    access: "Fixed Term",
    protection: "FSCS",
    tags: ["Cash ISA", "Fixed"],
  },
  {
    id: 9,
    name: "Limited Access Saver",
    provider: "Yorkshire BS",
    type: "Savings Account",
    rateType: "Variable",
    rate: 5.1,
    minDeposit: 1,
    maxDeposit: 250000,
    term: "None",
    access: "Limited",
    protection: "FSCS",
    tags: ["Savings Account", "Variable"],
  },
  {
    id: 10,
    name: "18 Month Fixed Bond",
    provider: "Paragon Bank",
    type: "Savings Account",
    rateType: "Fixed",
    rate: 5.2,
    minDeposit: 1000,
    maxDeposit: 500000,
    term: "18 months",
    access: "Fixed Term",
    protection: "FSCS",
    tags: ["Savings Account", "Fixed"],
  },
  {
    id: 11,
    name: "UK Government Gilt 2030",
    provider: "UK Treasury",
    type: "Gilt",
    rateType: "Fixed",
    rate: 5.0,
    minDeposit: 100,
    maxDeposit: null,
    term: "7 years",
    access: "Secondary Market",
    protection: "Government Backed",
    tags: ["GILT", "Fixed"],
  },
  {
    id: 12,
    name: "Regular Saver",
    provider: "NatWest",
    type: "Savings Account",
    rateType: "Fixed",
    rate: 6.17,
    minDeposit: 1,
    maxDeposit: 150,
    term: "1 year",
    access: "Monthly Deposits",
    protection: "FSCS",
    tags: ["Savings Account", "Fixed"],
  },
  {
    id: 13,
    name: "5 Year Fixed Rate ISA",
    provider: "Coventry BS",
    type: "Cash ISA",
    rateType: "Fixed",
    rate: 5.45,
    minDeposit: 1,
    maxDeposit: 20000,
    term: "5 years",
    access: "Fixed Term",
    protection: "FSCS",
    tags: ["Cash ISA", "Fixed"],
  },
  {
    id: 14,
    name: "Notice Savings Account",
    provider: "Shawbrook Bank",
    type: "Savings Account",
    rateType: "Variable",
    rate: 5.05,
    minDeposit: 1000,
    maxDeposit: 85000,
    term: "None",
    access: "120 Day Notice",
    protection: "FSCS",
    tags: ["Savings Account", "Variable"],
  },
  {
    id: 15,
    name: "Junior Cash ISA",
    provider: "Skipton BS",
    type: "Cash ISA",
    rateType: "Variable",
    rate: 5.3,
    minDeposit: 1,
    maxDeposit: 9000,
    term: "Until 18",
    access: "Fixed Term",
    protection: "FSCS",
    tags: ["Cash ISA", "Variable"],
  },
]

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [rateFilter, setRateFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.provider.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || product.type === typeFilter
    const matchesRate = rateFilter === "all" || product.rateType === rateFilter
    return matchesSearch && matchesType && matchesRate
  })

  return (
    <div className="container px-4 py-6 md:py-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Investment Products</h1>
          <p className="text-muted-foreground">Browse and compare available investment products</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Savings Account">Savings Account</SelectItem>
              <SelectItem value="Cash ISA">Cash ISA</SelectItem>
              <SelectItem value="Gilt">Gilt</SelectItem>
            </SelectContent>
          </Select>
          <Select value={rateFilter} onValueChange={setRateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Rate Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rates</SelectItem>
              <SelectItem value="Fixed">Fixed Rate</SelectItem>
              <SelectItem value="Variable">Variable Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Min Deposit</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Protection</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="whitespace-nowrap py-4 font-medium">{product.name}</TableCell>
                      <TableCell className="whitespace-nowrap py-4">{product.provider}</TableCell>
                      <TableCell className="whitespace-nowrap py-4 text-right">
                        <span className="font-medium">{product.rate}%</span>
                        <span className="ml-1 text-xs text-muted-foreground">{product.rateType}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-4">{product.term}</TableCell>
                      <TableCell className="whitespace-nowrap py-4">£{product.minDeposit.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap py-4">{product.access}</TableCell>
                      <TableCell className="whitespace-nowrap py-4">
                        <Badge variant="secondary">{product.protection}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

