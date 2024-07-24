import * as fs from "fs";
import { join } from "path";
import satori from "satori";
import sharp from "sharp";

const interMedium = fs.readFileSync(
  join(process.cwd(), "font/Inter-Medium.ttf")
);

const interBold = fs.readFileSync(join(process.cwd(), "font/Inter-Bold.ttf"));

const interLight = fs.readFileSync(join(process.cwd(), "font/Inter-Light.ttf"));

export const getInitialFrameImage = async (imageURL: string) => {
  const svg = await satori(
    <div
      style={{
        fontFamily: "Inter",
        width: 800,
        height: 800,
        border: "1px solid #E0E0E0",
        backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}celeb-collage.jpg')`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div>
        <img src={imageURL} alt="" />
      </div>
    </div>,
    {
      width: 600,
      height: 800,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "Inter",
          data: interMedium,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: interLight,
          weight: 300,
          style: "normal",
        },
      ],
    }
  );

  return (await sharp(Buffer.from(svg)).toFormat("png").toBuffer()).toString(
    "base64"
  );
};
