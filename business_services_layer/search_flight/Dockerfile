FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /search_flight

# copy csproj and restore as distinct layers
COPY search_flight/*.csproj .
RUN dotnet restore

# copy everything else and build app
COPY search_flight/. .
WORKDIR /search_flight
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS runtime
WORKDIR /search_flight
COPY --from=build /search_flight/out ./
ENTRYPOINT ["dotnet", "search_flight.dll"]