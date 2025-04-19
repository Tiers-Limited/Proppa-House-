const fs = require("fs");
const path = require("path");
const Folder = require("../../../models/Folder");
const sharp = require("sharp");
const MediaFile = require("../../../models/MediaFile");

exports.createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    const basePath = path.join(__dirname, "../../../", "public", "Media");
    let folderPath = path.join(basePath, name);

    if (parentId) {
      const parentFolder = await Folder.findById(parentId);
      if (!parentFolder)
        return res.status(404).json({ message: "Parent folder not found" });
      const parentPath = path.join(
        basePath,
        await getFullFolderPath(parentFolder)
      );
      folderPath = path.join(parentPath, name);
    }

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const newFolder = new Folder({
      name,
      parent: parentId || null,
    });

    await newFolder.save();
    res.status(201).json({ message: "Folder created", folder: newFolder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating folder", error: err.message });
  }
};

// Helper function to build folder path
const getFullFolderPath = async (folder) => {
  if (!folder.parent) return folder.name;
  const parent = await Folder.findById(folder.parent);
  return path.join(await getFullFolderPath(parent), folder.name);
};

exports.uploadFile = async (req, res) => {
  try {
    const { title, altText, description, folderId, tags, compress } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "svg", "webp"].includes(
      ext.replace(".", "")
    );
    const isVideo = ["mp4", "webm"].includes(ext.replace(".", ""));
    const sizeMB = file.size / (1024 * 1024);

    if (isImage && sizeMB > 1.5)
      return res
        .status(400)
        .json({ message: "Image size exceeds 1.5MB limit" });
    if (isVideo && sizeMB > 5)
      return res.status(400).json({ message: "Video size exceeds 5MB limit" });

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const basePath = path.join(__dirname, "../../../", "public", "Media");
    const folderPath = path.join(basePath, await getFullFolderPath(folder));

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    let fileName = `${Date.now()}-${file.originalname}`;
    let filePath = path.join(folderPath, fileName);

    // Compress if image and compress flag is true
    if (compress === "true" && isImage) {
      await sharp(file.buffer).jpeg({ quality: 60 }).toFile(filePath);
    } else {
      fs.writeFileSync(filePath, file.buffer);
    }

    const newFile = new MediaFile({
      title,
      altText,
      description,
      folder: folderId,
      tags: tags?.split(",") || [],
      fileType: file.mimetype,
      fileExtension: ext,
      fileName,
      filePath: `/Media/${await getFullFolderPath(folder)}/${fileName}`,
      sizeInMB: parseFloat(sizeMB.toFixed(2)),
      isCompressed: compress === "true",
      thumbnail: isVideo ? req.body.thumbnail || null : null,
    });

    await newFile.save();
    res.status(201).json({ message: "File uploaded", file: newFile });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error uploading file", error: err.message });
  }
};

exports.renameFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { newName } = req.body;

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const basePath = path.join(__dirname, "../../../", "public", "Media");
    const oldPath = path.join(basePath, await getFullFolderPath(folder));
    const newPath = path.join(
      basePath,
      path.dirname(await getFullFolderPath(folder)),
      newName
    );

    // Rename on file system
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    }

    // Update in database
    folder.name = newName;
    await folder.save();

    res.status(200).json({ message: "Folder renamed", folder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error renaming folder", error: err.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const basePath = path.join(__dirname, "../../../", "public", "Media");
    const folderPath = path.join(basePath, await getFullFolderPath(folder));

    // Recursively delete folder from file system
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // Delete subfolders and media files in DB
    await deleteFolderAndContents(folder._id);

    res.status(200).json({ message: "Folder and contents deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting folder", error: err.message });
  }
};

const deleteFolderAndContents = async (folderId) => {
  const subfolders = await Folder.find({ parent: folderId });
  for (const sub of subfolders) {
    await deleteFolderAndContents(sub._id);
  }

  await MediaFile.deleteMany({ folder: folderId });
  await Folder.findByIdAndDelete(folderId);
};

exports.moveFileToFolder = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { destinationFolderId } = req.body;

    const file = await MediaFile.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const oldFolder = await Folder.findById(file.folder);
    const newFolder = await Folder.findById(destinationFolderId);
    if (!newFolder)
      return res.status(404).json({ message: "Destination folder not found" });

    const baseDir = path.join(__dirname, "../../../", "public", "Media");

    const getFolderPath = async (folder) => {
      if (!folder.parent) return folder.name;
      const parent = await Folder.findById(folder.parent);
      return path.join(await getFolderPath(parent), folder.name);
    };

    const oldPath = path.join(
      baseDir,
      await getFolderPath(oldFolder),
      file.fileName
    );
    const newPath = path.join(
      baseDir,
      await getFolderPath(newFolder),
      file.fileName
    );

    // Create directory if doesn't exist
    fs.mkdirSync(path.dirname(newPath), { recursive: true });

    // Move file
    fs.renameSync(oldPath, newPath);

    // Update DB
    file.folder = destinationFolderId;
    file.filePath = path.relative(baseDir, newPath);
    await file.save();

    res.status(200).json({ message: "File moved successfully", file });
  } catch (err) {
    res.status(500).json({ message: "Error moving file", error: err.message });
  }
};
