# Snapshot Browser Web App
Snapshot Browser is a system that allows files from read-only snapshots (e.g., btrfs snapshots) to be read conveniently.
It was designed for scenarios where snapshots are created frequently (e.g., every 15 minutes).
Each snapshot is contained in a folder with the data and time in the folder name.
Not all the snapshots are kept for a long time (i.e., a snapshot may be deleted as soon as a new snapshot is created).
Hence it is not possible to create stable links to the snapshots.
This system will provide easy access to the most recent snapshot.

## Architecture
The Snapshot Browser consists of two parts: an API and a front-end.
This repository contains the web front-end.
The API is implemented as a REST web API.

## License

This work is licensed under the MIT or Apache 2.0 license.

`SPDX-License-Identifier: MIT OR Apache-2.0`