import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const FilterPanel = ({ filters, onApplyFilters, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filter Documents</h3>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="filter-owner">Owner</Label>
          <Input
            id="filter-owner"
            placeholder="Search by owner..."
            value={localFilters.owner || ""}
            onChange={(e) => setLocalFilters({ ...localFilters, owner: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-vehicle">Vehicle Number</Label>
          <Input
            id="filter-vehicle"
            placeholder="Search by vehicle..."
            value={localFilters.vehicleNumber || ""}
            onChange={(e) => setLocalFilters({ ...localFilters, vehicleNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>CF Expiry Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.cfStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="block whitespace-normal">{localFilters.cfStart ? format(localFilters.cfStart, "PPP") : "Start"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.cfStart}
                  onSelect={(date) => setLocalFilters({ ...localFilters, cfStart: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.cfEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="block whitespace-normal">{localFilters.cfEnd ? format(localFilters.cfEnd, "PPP") : "End"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.cfEnd}
                  onSelect={(date) => setLocalFilters({ ...localFilters, cfEnd: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>NP Expiry Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.npStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="block whitespace-normal">{localFilters.npStart ? format(localFilters.npStart, "PPP") : "Start"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.npStart}
                  onSelect={(date) => setLocalFilters({ ...localFilters, npStart: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.npEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="block whitespace-normal">{localFilters.npEnd ? format(localFilters.npEnd, "PPP") : "End"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.npEnd}
                  onSelect={(date) => setLocalFilters({ ...localFilters, npEnd: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Auth Expiry Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.authStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="block whitespace-normal">{localFilters.authStart ? format(localFilters.authStart, "PPP") : "Start"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.authStart}
                  onSelect={(date) => setLocalFilters({ ...localFilters, authStart: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.authEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="block whitespace-normal">{localFilters.authEnd ? format(localFilters.authEnd, "PPP") : "End"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.authEnd}
                  onSelect={(date) => setLocalFilters({ ...localFilters, authEnd: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-end">
          <Button onClick={handleApply} className="w-full gap-2">
            <Search className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
