# Start a temporary container with the .NET SDK. We use it to build the app.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Make /app the current folder inside this temporary container.
WORKDIR /app

# Copy the solution file first.
COPY Carsties.slnx ./

# Copy only the project files first, so Docker can reuse the package-download cache.
# dont forget the last '/' to let docker treat them as folder
COPY src/AuctionService/AuctionService.csproj ./src/AuctionService/
COPY src/Contracts/Contracts.csproj ./src/Contracts/

# Download the NuGet packages needed by the Auction Service.
RUN dotnet restore ./src/AuctionService/AuctionService.csproj

# Copy the rest of the source code into the build container.
COPY . .

# Compile and publish a Release version of the app into /app/publish.
RUN dotnet publish ./src/AuctionService/AuctionService.csproj -c Release -o /app/publish

# Start a new, smaller container that has only the .NET runtime needed to run the app.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

# Make /app the current folder inside the final container.
WORKDIR /app

# Document that the app listens on port 80.
EXPOSE 80

# Copy the published app from the build container into this final container.
COPY --from=build /app/publish .

# Run the Auction Service when the container starts.
ENTRYPOINT [ "dotnet", "AuctionService.dll" ]