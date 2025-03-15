'use client';

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Label } from "./ui/label";

interface KeySelectorProps {
  keys: string[];
  selectedKey: string;
  onKeyChange: (key: string) => void;
}

export default function KeySelector({ keys, selectedKey, onKeyChange }: KeySelectorProps) {
  return (
    <div className="flex flex-row w-min space-x-2">
      <Label className="text-sm font-medium whitespace-nowrap">
        Select Key
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-min justify-between">
            {selectedKey}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Keys</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedKey} onValueChange={onKeyChange}>
            {keys.map((key) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {key}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}