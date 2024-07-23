import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AICharacterCard from "@/components/AICharacterCard";

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
        <div className="flex gap-10 flex-wrap">
          {myCharacters.map((character: string[]) => {
            return (
              <AICharacterCard
                key={character[1]}
                name={character[0]}
                cid={character[1]}
                imageURL={character[2]}
                owner={character[3]}
                personality1={character[4]}
                personality2={character[5]}
                personality3={character[6]}
                description={character[7]}
                ethEarned={character[8]}
              ></AICharacterCard>
            );
          })}
        </div>
      </TabsContent>
      <TabsContent value="password">
        {" "}
        <div className="flex gap-10 flex-wrap">
          {myCharacters.map((character: string[]) => {
            return (
              <AICharacterCard
                key={character[1]}
                name={character[0]}
                cid={character[1]}
                imageURL={character[2]}
                owner={character[3]}
                personality1={character[4]}
                personality2={character[5]}
                personality3={character[6]}
                description={character[7]}
                ethEarned={character[8]}
              ></AICharacterCard>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TabBar;
