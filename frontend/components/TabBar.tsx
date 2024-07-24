import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AICharacterCard from "./AICharacterCard";
import ReactLoading from "react-loading";

const TabBar = ({
  myCharacters,
  allCharacters,
}: {
  myCharacters: any;
  allCharacters: any;
}) => {
  return (
    <Tabs defaultValue="userCharacters">
      <TabsList>
        <TabsTrigger value="userCharacters">My Characters</TabsTrigger>
        <TabsTrigger value="allCharacters">All Characters</TabsTrigger>
      </TabsList>
      <TabsContent value="userCharacters">
        {myCharacters ? (
          <div className="flex gap-10 flex-wrap">
            {myCharacters.map((character: string[]) => {
              return (
                <AICharacterCard
                  isUserCharacter={true}
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
        ) : (
          <div className="h-[200px] w-[200px] flex justify-center items-center ">
            <ReactLoading
              type={"spin"}
              color={"#845DCC"}
              height={100}
              width={100}
            />
          </div>
        )}
      </TabsContent>
      <TabsContent value="allCharacters">
        {allCharacters ? (
          <div className="flex gap-10 flex-wrap">
            {allCharacters.map((character: string[]) => {
              return (
                <AICharacterCard
                  isUserCharacter={false}
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
        ) : (
          <div className="h-[200px] w-[200px] flex justify-center items-center ">
            <ReactLoading
              type={"spin"}
              color={"#845DCC"}
              height={100}
              width={100}
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TabBar;
