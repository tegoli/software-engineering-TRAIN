/**
 * @file TrainSearchResult.js
 * @brief Holds the list of train routes returned by a search.
 * @details Stores the search results and lets you filter and sort them before sending them to the UI.
 */
export class TrainSearchResult {
    /** * @brief Unique ID for this search result set.
     * @type {number} 
     */ 
    resultId;

    /** * @brief Number of trains found in the search.
     * @type {number} 
     */ 
    resultCount;

    /** * @brief The list of train objects from the search.
     * @type {Array} 
     */ 
    trains;

    /**
     * @brief Formats the results so they can be shown on screen.
     * @details Uses the search criteria to sort and format the results.
     * @param {SearchCriteria} criteria - Search criteria used for formatting.
     * @return {void|Array}
     */
    displayResults(criteria) {
        // return filtered list
    }

    /**
     * @brief Filters the train list based on extra rules.
     * @details Lets you narrow down results by things like price or travel time after the search is done.
     * @param {SearchCriteria} criteria - Filter rules to apply.
     * @return {void|Array}
     */
    applyFilters(criteria) {
        // subset results
    }
}
