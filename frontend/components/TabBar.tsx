import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AICharacter {
  name: string;
  characterId: string;
  personality1: string;
  personality2: string;
  personality3: string;
  personality4: string;
  description: string;
  enabledPersonality1: boolean;
  enabledPersonality2: boolean;
  enabledPersonality3: boolean;
  enabledPersonality4: boolean;
}

const TabBar = ({
  myCharacters,
  allCharacters,
}: {
  myCharacters: any;
  allCharacters: any;
}) => {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">My Characters</TabsTrigger>
        <TabsTrigger value="password">All Characters</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        {myCharacters.map((character: AICharacter) => (
          <div
            key={character.characterId}
            className="flex items-center justify-between p-4 border-b"
          >
            <div>
              <p className="text-lg font-semibold">{character.name}</p>
              <p className="text-sm text-gray-500">{character.description}</p>
            </div>
            <div>
              <Link
                href={`/celebs/${character.characterId}`}
                className="text-[#845DCC]"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default TabBar;
