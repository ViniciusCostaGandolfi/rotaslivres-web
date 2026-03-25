export interface CoordinateDto {
  lat?: number | null;
  lng?: number | null;
}

export interface AddressDto {
  formattedAddress: string;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  postalCode: string;
  neighborhood: string;
  complement: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface OriginDto {
  address: AddressDto;
}

export interface ClientDto {
  id: string;
  volumeLiters: number;
  weightKg: number;
  createdAt?: number;
  address: AddressDto;
}

export interface VehicleTypeDto {
  id?: string;
  name: string;
  maxVolumeLiters: number | null;
  maxWeightKg: number | null;
  maxDeliveries: number | null;
  maxDistanceMeters: number | null;
  minRoutes: number;
  maxRoutes: number | null;
  targetProportion: number | null;
  fixedCost: number;
}

export interface VrpIn {
  id?: string;
  origin: OriginDto;
  clients: ClientDto[];
  vehicles: VehicleTypeDto[];
  forceRouteCount?: number;
  maxRouteDistance?: number;
  createdAt?: string;
}

export interface VrpRoute {
  id: number;
  distanceMeters: number;
  volumeLiters: number;
  weightKg: number;
  vehicleId?: string;
  vehicleName?: string;
  clients: ClientDto[];
  // routeLine expects an array of LngLatLike pairs: [lng, lat] (or lat/lng as object depending on LngLatLike mapping in maplibre)
  // map-vrp.component uses routeLine[i] as a LngLatLike object if I see center assignment, or it's just [lng, lat]
  // Wait, center is { lat, lng }. Let's define routeLine as array of {lat, lng} objects or just any[].
  routeLine: any[];
  linkGoogleMaps: string;
}

export interface Vrp {
  id: string;
  origin: OriginDto;
  routes: VrpRoute[];
  unassignedClients?: ClientDto[];
  createdAt: string;
}

export interface SolutionDto {
  id: number;
  createdAt: string;
  inputPath: string;
  outputPath: string;
  solverStatus: string;
  durationMillis: number;
  errorMessage?: string;
  warningMessage?: string;
  modelName?: string;
}

export type VrpClient = ClientDto;
export type FullMerchantDto = OriginDto;
export type VrpOrigin = OriginDto;

