FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /register_flight-user

# copy csproj and restore as distinct layers
COPY register_flight-user/*.csproj .
RUN dotnet restore

# copy everything else and build app
COPY register_flight-user/. .
WORKDIR /register_flight-user
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS runtime
WORKDIR /register_flight-user
COPY --from=build /register_flight-user/out ./
ENTRYPOINT ["dotnet", "register_flight-user.dll"]