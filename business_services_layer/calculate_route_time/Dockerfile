FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /calculate_route_time

# copy csproj and restore as distinct layers
COPY calculate_route_time/*.csproj .
RUN dotnet restore

# copy everything else and build app
COPY calculate_route_time/. .
WORKDIR /calculate_route_time
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS runtime
WORKDIR /calculate_route_time
COPY --from=build /calculate_route_time/out ./
ENTRYPOINT ["dotnet", "calculate_route_time.dll"]