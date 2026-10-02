# Docker Engine Was Not Running

## Scenario

During prerequisite verification, before running the Jenkins pipeline, Docker was tested from the Windows PowerShell terminal to confirm that both the Docker CLI and Docker engine were available.

The Docker CLI was installed and recognized, but it could not communicate with the Docker Desktop Linux engine.

## Error

Running:

```powershell
docker version
```

returned an error indicating that Docker could not connect to:

```text
npipe:////./pipe/dockerDesktopLinuxEngine
```

The Docker client was installed, but the Docker engine was unavailable.

## Why It Happened

Installing the Docker CLI does not mean that the Docker engine is always running.

Docker Desktop provides the Docker engine used by the local Windows environment.

At the time of the test, Docker Desktop was not running, so the Docker client had no active engine to communicate with.

The active Docker context was:

```text
desktop-linux
```

which expected the Docker Desktop Linux engine to be available.

## Troubleshooting

The Docker installation was checked using:

```powershell
docker version
```

The Docker contexts were also inspected:

```powershell
docker context show
docker context ls
```

The active context was `desktop-linux`.

This confirmed that the Docker CLI was installed correctly, but its connection to the Docker Desktop engine was failing.

## Resolution

Docker Desktop was started on the Windows machine.

After Docker Desktop finished starting, the Docker commands were executed again.

## Verification

The following command:

```powershell
docker version
```

successfully displayed both the Docker **Client** and **Server** information.

The following command was also executed:

```powershell
docker ps
```

It completed successfully and displayed the container list.

This confirmed that the Docker engine was running and accessible.

## Commands Used

```powershell
docker version
docker context show
docker context ls
docker ps
```

## What I Learned

The Docker CLI and Docker engine are separate components.

The CLI can be installed and recognized by the operating system while Docker commands that require the engine can still fail if Docker Desktop is not running.

Checking both the Docker Client and Server information using `docker version` is a useful way to distinguish between a CLI installation problem and an engine connectivity problem.

## Key Takeaway

When Docker commands fail with an engine connection error, first verify that Docker Desktop and the Docker engine are running before changing Docker or Jenkins configuration.