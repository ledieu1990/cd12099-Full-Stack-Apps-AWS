import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
app.get("/filteredimage", async (req, res) => {
  const imageUrl = req.query.image_url;

  if (!imageUrl) {
    return res.status(400).send("Missing an image url.");
  }

  const imageExt = [".jpg", ".jpeg", ".png", ".gif", ".tiff", ".bmp"];
  const isImageUrl = imageExt.some((ext) => imageUrl.endsWith(ext));
  if (!isImageUrl) {
    return res
      .status(415)
      .send("The URL does not point to an image. Please check!");
  }

  const imageLocalPath = await filterImageFromURL(imageUrl);

  return res.status(200).sendFile(imageLocalPath, (error) => {
    if (error) {
      console.log("Error while sending the file: ", error);
    } else {
      deleteLocalFiles([imageLocalPath]);
    }
  });
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
