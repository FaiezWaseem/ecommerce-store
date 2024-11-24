import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchForm({ className }: React.HTMLAttributes<HTMLFormElement>) {
  return (
    <form className={className}>
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="What are you looking for?"
          className="flex-1"
        />
        <Button type="submit" size="sm">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}

