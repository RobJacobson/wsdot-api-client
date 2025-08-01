// WSF Schedule API functions
// Documentation: https://www.wsdot.wa.gov/ferries/api/schedule/documentation/rest.html
// API Help: https://www.wsdot.wa.gov/ferries/api/schedule/rest/help

import { createFetchFactory } from "@/shared/fetching/api";

import type {
  ActiveSeason,
  Alert,
  AlternativeFormat,
  Route,
  RouteDetails,
  Sailing,
  ScheduledRoute,
  ScheduleResponse,
  ScheduleTerminal,
  ScheduleTerminalCombo,
  TimeAdjustment,
  ValidDateRange,
} from "./types";

// Create a factory function for WSF Schedule API
const createFetch = createFetchFactory("/ferries/api/schedule/rest");

// ============================================================================
// CACHE FLUSH DATE API FUNCTIONS
// ============================================================================

/**
 * API function for fetching cache flush date from WSF Schedule API
 *
 * Retrieves the cache flush date for the schedule API. This endpoint helps
 * determine when cached data should be refreshed. When the date returned
 * from this operation is modified, drop your application cache and retrieve
 * fresh data from the service.
 *
 * @param logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to Date object containing cache flush information
 * @throws {WsfApiError} When the API request fails
 *
 * @example
 * ```typescript
 * const flushDate = await getCacheFlushDateSchedule();
 * console.log(flushDate); // "2024-01-15T10:30:00Z"
 * ```
 */
export const getCacheFlushDateSchedule = createFetch<Date>("/cacheflushdate");

// ============================================================================
// VALID DATE RANGE API FUNCTIONS
// ============================================================================

/**
 * API function for fetching valid date range from WSF Schedule API
 *
 * Retrieves a date range for which schedule data is currently published & available.
 * A valid API Access Code from the WSDOT Traveler API must be passed as part of the URL string.
 * Please consider using cacheflushdate to coordinate the caching of this data in your application.
 *
 * @param logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to ValidDateRange object containing valid date range information
 * @throws {WsfApiError} When the API request fails
 *
 * @example
 * ```typescript
 * const dateRange = await getValidDateRange();
 * console.log(dateRange.StartDate); // "2024-01-01T00:00:00Z"
 * ```
 */
export const getValidDateRange = createFetch<ValidDateRange>("/validdaterange");

// ============================================================================
// TERMINALS API FUNCTIONS
// ============================================================================

/**
 * API function for fetching terminals from WSF Schedule API
 *
 * Retrieves valid departing terminals for a given trip date. A valid trip date
 * may be determined using validDateRange.
 *
 * @param params - Object containing tripDate and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ScheduleTerminal objects containing terminal information
 * @throws {WsfApiError} When the API request fails
 *
 * @example
 * ```typescript
 * const terminals = await getTerminals({ tripDate: new Date('2024-01-15') });
 * console.log(terminals[0].TerminalName); // "Anacortes"
 * ```
 */
export const getTerminals = createFetch<{ tripDate: Date }, ScheduleTerminal[]>(
  `/terminals/{tripDate}`
);

/**
 * API function for fetching terminals and mates from WSF Schedule API
 *
 * Retrieves all valid departing and arriving terminal combinations for a given trip date.
 * A valid trip date may be determined using validDateRange.
 *
 * @param params - Object containing tripDate and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ScheduleTerminalCombo objects containing terminal combinations
 * @throws {WsfApiError} When the API request fails
 */
export const getTerminalsAndMates = createFetch<
  { tripDate: Date },
  ScheduleTerminalCombo[]
>(`/terminalsandmates/{tripDate}`);

/**
 * API function for fetching terminals and mates by route from WSF Schedule API
 *
 * Provides valid departing and arriving terminal combinations for a given trip date and route.
 * Valid routes may be found by using routes. Similarly, a valid trip date may be determined
 * using validDateRange.
 *
 * @param params - Object containing tripDate, routeId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.routeId - The unique identifier for the route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ScheduleTerminalCombo objects containing terminal combinations for the route
 * @throws {WsfApiError} When the API request fails
 */
export const getTerminalsAndMatesByRoute = createFetch<
  { tripDate: Date; routeId: number },
  ScheduleTerminalCombo[]
>(`/terminalsandmatesbyroute/{tripDate}/{routeId}`);

/**
 * API function for fetching terminal mates from WSF Schedule API
 *
 * Provides arriving terminals for a given departing terminal and trip date. A valid departing
 * terminal may be found by using terminals. Similarly, a valid trip date may be determined
 * using validDateRange.
 *
 * @param params - Object containing tripDate, terminalId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.terminalId - The unique identifier for the departing terminal
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ScheduleTerminal objects containing arriving terminals
 * @throws {WsfApiError} When the API request fails
 */
export const getTerminalMates = createFetch<
  { tripDate: Date; terminalId: number },
  ScheduleTerminal[]
>(`/terminalmates/{tripDate}/{terminalId}`);

// ============================================================================
// ROUTES API FUNCTIONS
// ============================================================================

/**
 * API function for fetching all routes from WSF Schedule API
 *
 * Retrieves the most basic/brief information pertaining to routes for a given trip date.
 * If only a trip date is included, all routes available for that date of travel are returned.
 * Valid trip dates may be determined using the validDateRange endpoint.
 *
 * @param params - Object containing tripDate and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Route objects containing basic route information
 * @throws {WsfApiError} When the API request fails
 *
 * @example
 * ```typescript
 * const routes = await getRoutes({ tripDate: new Date('2024-01-15') });
 * console.log(routes[0].RouteAbbrev); // "ANA-SID"
 * ```
 */
export const getRoutes = createFetch<{ tripDate: Date }, Route[]>(
  `/routes/{tripDate}`
);

/**
 * API function for fetching routes between specific terminals from WSF Schedule API
 *
 * Retrieves the most basic/brief information pertaining to routes filtered by departing
 * and arriving terminals for a given trip date. Routes in the resultset are filtered
 * to match the specified terminal combination. Valid departing and arriving terminals
 * may be found using the terminalsAndMates endpoint.
 *
 * @param params - Object containing tripDate, departingTerminalId, arrivingTerminalId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.departingTerminalId - The unique identifier for the departing terminal
 * @param params.arrivingTerminalId - The unique identifier for the arriving terminal
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Route objects filtered by terminal combination
 * @throws {WsfApiError} When the API request fails
 */
export const getRoutesByTerminals = createFetch<
  { tripDate: Date; departingTerminalId: number; arrivingTerminalId: number },
  Route[]
>(`/routes/{tripDate}/{departingTerminalId}/{arrivingTerminalId}`);

/**
 * API function for fetching routes with service disruptions from WSF Schedule API
 *
 * Retrieves the most basic/brief information for routes currently associated with
 * service disruptions for a given trip date. This endpoint helps identify routes
 * that may have delays, cancellations, or other service issues.
 *
 * @param params - Object containing tripDate and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Route objects that have service disruptions
 * @throws {WsfApiError} When the API request fails
 */
export const getRoutesWithDisruptions = createFetch<
  { tripDate: Date },
  Route[]
>(`/routeshavingservicedisruptions/{tripDate}`);

/**
 * API function for fetching detailed route information from WSF Schedule API
 *
 * Retrieves highly detailed information pertaining to routes for a given trip date.
 * If only a trip date is included, all routes available for that date of travel are returned.
 * This endpoint provides comprehensive route details including sailing times, vessel assignments,
 * and operational information.
 *
 * @param params - Object containing tripDate and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Route objects containing detailed route information
 * @throws {WsfApiError} When the API request fails
 */
export const getRouteDetails = createFetch<{ tripDate: Date }, Route[]>(
  `/routedetails/{tripDate}`
);

/**
 * API function for fetching detailed route information between specific terminals from WSF Schedule API
 *
 * Retrieves highly detailed information pertaining to routes filtered by departing and
 * arriving terminals for a given trip date. Routes in the resultset are filtered to match
 * the specified terminal combination. Valid departing and arriving terminals may be found
 * using the terminalsAndMates endpoint.
 *
 * @param params - Object containing tripDate, departingTerminalId, arrivingTerminalId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.departingTerminalId - The unique identifier for the departing terminal
 * @param params.arrivingTerminalId - The unique identifier for the arriving terminal
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Route objects with detailed information filtered by terminal combination
 * @throws {WsfApiError} When the API request fails
 */
export const getRouteDetailsByTerminals = createFetch<
  { tripDate: Date; departingTerminalId: number; arrivingTerminalId: number },
  Route[]
>(`/routedetails/{tripDate}/{departingTerminalId}/{arrivingTerminalId}`);

/**
 * API function for fetching detailed route information by route ID from WSF Schedule API
 *
 * Retrieves highly detailed information for a specific route identified by route ID
 * for a given trip date. This endpoint filters the resultset to a single route,
 * providing comprehensive details for that specific route.
 *
 * @param params - Object containing tripDate, routeId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.routeId - The unique identifier for the route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to a RouteDetails object containing detailed information for the specified route
 * @throws {WsfApiError} When the API request fails
 */
export const getRouteDetailsByRoute = createFetch<
  { tripDate: Date; routeId: number },
  RouteDetails
>(`/routedetails/{tripDate}/{routeId}`);

// ============================================================================
// ACTIVE SEASONS API FUNCTIONS
// ============================================================================

/**
 * API function for fetching active seasons from WSF Schedule API
 *
 * Retrieves a summary of active seasons. This endpoint provides information about
 * current and upcoming ferry service seasons, which can be used to determine
 * valid schedule IDs for other endpoints.
 *
 * @param logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ActiveSeason objects containing active season information
 * @throws {WsfApiError} When the API request fails
 */
export const getActiveSeasons = createFetch<ActiveSeason[]>("/activeseasons");

// ============================================================================
// SCHEDULED ROUTES API FUNCTIONS
// ============================================================================

/**
 * API function for fetching scheduled routes from WSF Schedule API
 *
 * Provides a listing of routes that are active for a season. Results include all known
 * scheduled routes spanning current and upcoming seasons. For example, "Anacortes / Sidney B.C."
 * may be a valid route, but if it's not scheduled to run during a specific season,
 * it won't be returned as part of that season's scheduled routes resultset.
 *
 * @param logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ScheduledRoute objects representing all scheduled routes
 * @throws {WsfApiError} When the API request fails
 */
export const getScheduledRoutes = createFetch<ScheduledRoute[]>("/schedroutes");

/**
 * API function for fetching scheduled routes by season from WSF Schedule API
 *
 * Provides a listing of routes that are active for a specific season identified by schedule ID.
 * Results are filtered to only include scheduled routes for the specified season.
 * Seasons may be determined using the activeSeasons endpoint.
 *
 * @param params - Object containing scheduleId and optional logMode
 * @param params.scheduleId - The unique identifier for the season (schedule ID)
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of ScheduledRoute objects representing scheduled routes for the specified season
 * @throws {WsfApiError} When the API request fails
 */
export const getScheduledRoutesBySeason = createFetch<
  { scheduleId: number },
  ScheduledRoute[]
>(`/schedroutes/{scheduleId}`);

// ============================================================================
// SAILINGS API FUNCTIONS
// ============================================================================

/**
 * API function for fetching sailings from WSF Schedule API
 *
 * Provides sailings for a particular scheduled route. Sailings are departure times
 * organized by direction of travel (eastbound / westbound), days of operation groups
 * (daily, weekday, weekend, etc) and, in some cases, date ranges (eg. Early Fall / Late Fall).
 * Sailings largely mimic the groupings of departures found on the printed PDF version of the schedule.
 * Scheduled routes may be determined using schedRoutes.
 *
 * @param params - Object containing schedRouteId and optional logMode
 * @param params.schedRouteId - The unique identifier for the scheduled route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Sailing objects containing sailing information
 * @throws {WsfApiError} When the API request fails
 */
export const getSailings = createFetch<{ schedRouteId: number }, Sailing[]>(
  `/sailings/{schedRouteId}`
);

/**
 * API function for fetching all sailings from WSF Schedule API
 *
 * Provides all sailings for a particular scheduled route. Sailings are departure times
 * organized by direction of travel (eastbound / westbound), days of operation groups
 * (daily, weekday, weekend, etc) and, in some cases, date ranges (eg. Early Fall / Late Fall).
 * Sailings largely mimic the groupings of departures found on the printed PDF version of the schedule.
 * Scheduled routes may be determined using schedRoutes.
 *
 * @param params - Object containing schedRouteId and optional logMode
 * @param params.schedRouteId - The unique identifier for the scheduled route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Sailing objects containing all sailing information
 * @throws {WsfApiError} When the API request fails
 */
export const getAllSailings = createFetch<{ schedRouteId: number }, Sailing[]>(
  `/allsailings/{schedRouteId}`
);

// ============================================================================
// TIME ADJUSTMENTS API FUNCTIONS
// ============================================================================

/**
 * API function for fetching time adjustments from WSF Schedule API
 *
 * Provides a listing of all additions and cancellations that deviate on specific dates
 * from the scheduled times found in the sailings resultset (eg. tidal cancellations
 * affecting Port Townsend departures on 9/9/2014).
 *
 * @param logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of TimeAdjustment objects containing time adjustment information
 * @throws {WsfApiError} When the API request fails
 */
export const getTimeAdjustments = createFetch<TimeAdjustment[]>("/timeadj");

/**
 * API function for fetching time adjustments by route from WSF Schedule API
 *
 * Provides a listing of all additions and cancellations for a route that deviate on
 * specific dates from the scheduled times found in the sailings resultset (eg. tidal
 * cancellations affecting Port Townsend departures on 9/9/2014). A valid route may
 * be determined using routes.
 *
 * @param params - Object containing routeId and optional logMode
 * @param params.routeId - The unique identifier for the route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of TimeAdjustment objects containing time adjustment information for the route
 * @throws {WsfApiError} When the API request fails
 */
export const getTimeAdjustmentsByRoute = createFetch<
  { routeId: number },
  TimeAdjustment[]
>(`/timeadjbyroute/{routeId}`);

/**
 * API function for fetching time adjustments by scheduled route from WSF Schedule API
 *
 * Provides a listing of all additions and cancellations for a scheduled route that
 * deviate on specific dates from the scheduled times found in the sailings resultset
 * (eg. tidal cancellations affecting Port Townsend departures on 9/9/2014). A valid
 * scheduled route may be determined using schedRoutes.
 *
 * @param params - Object containing schedRouteId and optional logMode
 * @param params.schedRouteId - The unique identifier for the scheduled route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of TimeAdjustment objects containing time adjustment information for the scheduled route
 * @throws {WsfApiError} When the API request fails
 */
export const getTimeAdjustmentsBySchedRoute = createFetch<
  { schedRouteId: number },
  TimeAdjustment[]
>(`/timeadjbyschedroute/{schedRouteId}`);

// ============================================================================
// SCHEDULE API FUNCTIONS
// ============================================================================

/**
 * API function for fetching schedule by route from WSF Schedule API
 *
 * Provides departure times for a trip date and route. The resultset accounts for all
 * contingencies, sailing date ranges and time adjustments. Valid routes may be found
 * using routes. Similarly, a valid trip date may be determined using validDateRange.
 *
 * @param params - Object containing tripDate, routeId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.routeId - The unique identifier for the route
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to a ScheduleResponse object containing schedule information, or null if no schedule found
 * @throws {WsfApiError} When the API request fails
 */
export const getScheduleByRoute = createFetch<
  { tripDate: Date; routeId: number },
  ScheduleResponse
>(`/schedule/{tripDate}/{routeId}`);

/**
 * API function for fetching schedule by terminals from WSF Schedule API
 *
 * Provides departure times for a trip date and terminal combination. The resultset
 * accounts for all contingencies, sailing date ranges and time adjustments. Valid
 * departing and arriving terminals may be found using terminalsAndMates. Similarly,
 * a valid trip date may be determined using validDateRange.
 *
 * @param params - Object containing tripDate, departingTerminalId, arrivingTerminalId and optional logMode
 * @param params.tripDate - The trip date as a Date object
 * @param params.departingTerminalId - The unique identifier for the departing terminal
 * @param params.arrivingTerminalId - The unique identifier for the arriving terminal
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to a ScheduleResponse object containing schedule information, or null if no schedule found
 * @throws {WsfApiError} When the API request fails
 */
export const getScheduleByTerminals = createFetch<
  { tripDate: Date; departingTerminalId: number; arrivingTerminalId: number },
  ScheduleResponse
>(`/schedule/{tripDate}/{departingTerminalId}/{arrivingTerminalId}`);

/**
 * API function for fetching today's schedule by route from WSF Schedule API
 *
 * Provides today's departure times for a route. Valid routes may be found using routes.
 * For the onlyRemainingTimes value, please indicate 'true' if departure times prior
 * to now should not be included in the resultset and 'false' if they should be included
 * in the resultset.
 *
 * @param params - Object containing routeId, onlyRemainingTimes and optional logMode
 * @param params.routeId - The unique identifier for the route
 * @param params.onlyRemainingTimes - Whether to include only remaining departure times (defaults to false)
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to a ScheduleResponse object containing today's schedule information, or null if no schedule found
 * @throws {WsfApiError} When the API request fails
 */
export const getScheduleTodayByRoute = createFetch<
  { routeId: number; onlyRemainingTimes?: boolean },
  ScheduleResponse
>(`/scheduletoday/{routeId}/{onlyRemainingTimes}`);

/**
 * API function for fetching today's schedule by terminals from WSF Schedule API
 *
 * Provides today's departure times for a terminal combination. Valid departing and
 * arriving terminals may be found using terminalsAndMates. For the onlyRemainingTimes
 * value, please indicate 'true' if departure times prior to now should not be included
 * in the resultset and 'false' if they should be included in the resultset.
 *
 * @param params - Object containing departingTerminalId, arrivingTerminalId, onlyRemainingTimes and optional logMode
 * @param params.departingTerminalId - The unique identifier for the departing terminal
 * @param params.arrivingTerminalId - The unique identifier for the arriving terminal
 * @param params.onlyRemainingTimes - Whether to include only remaining departure times (defaults to false)
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to a ScheduleResponse object containing today's schedule information, or null if no schedule found
 * @throws {WsfApiError} When the API request fails
 */
export const getScheduleTodayByTerminals = createFetch<
  {
    departingTerminalId: number;
    arrivingTerminalId: number;
    onlyRemainingTimes?: boolean;
  },
  ScheduleResponse
>(
  `/scheduletoday/{departingTerminalId}/{arrivingTerminalId}/{onlyRemainingTimes}`
);

// ============================================================================
// ALERTS API FUNCTIONS
// ============================================================================

/**
 * API function for fetching alerts from WSF Schedule API
 *
 * Provides alert information tailored for routes, bulletins, service disruptions, etc.
 * This endpoint returns important notifications and updates that may affect ferry service,
 * including weather-related delays, maintenance notices, and other operational alerts.
 *
 * @param logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of Alert objects containing alert information
 * @throws {WsfApiError} When the API request fails
 */
export const getAlerts = createFetch<Alert[]>("/alerts");

// ============================================================================
// ALTERNATIVE FORMATS API FUNCTIONS
// ============================================================================

/**
 * API function for fetching alternative format data from WSF Schedule API
 *
 * Retrieves alternative format data for a given subject name. This endpoint
 * provides access to different data formats and representations that may be
 * useful for various applications and use cases.
 *
 * @param params - Object containing subjectName and optional logMode
 * @param params.subjectName - The subject name for which to retrieve alternative formats
 * @param params.logMode - Optional logging mode for debugging API calls
 * @returns Promise resolving to an array of AlternativeFormat objects containing format information
 * @throws {WsfApiError} When the API request fails
 */
export const getAlternativeFormats = createFetch<
  { subjectName: string },
  AlternativeFormat[]
>(`/alternativeformats/{subjectName}`);
