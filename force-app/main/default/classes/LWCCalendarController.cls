public class LWCCalendarController {

    @AuraEnabled(cacheable=true)
    public static List<sObject> search(String searchTerm, String myObject, String fields, String whereClauseField, String filter) {
        String query;
        String selectPart = 'SELECT ' + fields + ' FROM ' + myObject;

        if (searchTerm == null || searchTerm == '') {
            query = selectPart + ' WHERE LastViewedDate != NULL ' + filter + ' ORDER BY LastViewedDate DESC LIMIT  5';
        }
        else {
            query = selectPart + ' WHERE ' + whereClauseField + ' LIKE  \'%' + searchTerm + '%\' ' + filter + ' ORDER BY CreatedDate DESC LIMIT  5';
        }

        System.debug('[search] query' + query);

        return Database.query(query);
    }
}