package jsonParser;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
 
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

public class StreamParser1 {
	public static void main(String[] args) throws MalformedURLException, IOException {
		
		// Get a list of albums from free music archive. limit the results to 5
        String url = "http://freemusicarchive.org/api/get/albums.json?api_key=60BLHNQCAOUFPIBZ&limit=5";
        // get an instance of the json parser from the json factory
        JsonFactory factory = new JsonFactory();
        JsonParser parser = factory.createParser(new URL(url));
        
        // continue parsing the token till the end of input is reached
        while (!parser.isClosed()) {
        	// get the token
            JsonToken token = parser.nextToken();
            
            // if its the last token then we are done
            if (token == null)
                break;
            
            // we want to look for a field that says dataset
            if (JsonToken.FIELD_NAME.equals(token) && "dataset".equals(parser.getCurrentName())) {
            	 // we are entering the datasets now. The first token should be
                // start of array
                token = parser.nextToken();
                if (!JsonToken.START_ARRAY.equals(token)) {
                    // bail out
                    break;
                }
                // each element of the array is an album so the next token
                // should be {
                token = parser.nextToken();
                if (!JsonToken.START_OBJECT.equals(token)) {
                    break;
                }
                // we are now looking for a field that says "album_title". We
                // continue looking till we find all such fields. This is
                // probably not a best way to parse this json, but this will
                // suffice for this example.
                while (true) {
                    token = parser.nextToken();
                    if (token == null)
                        break;
                    if (JsonToken.FIELD_NAME.equals(token) && "album_title".equals(parser.getCurrentName())) {
                        token = parser.nextToken();
                        System.out.print("Album Title: "+ parser.getText());
                    }
                    
                    if (JsonToken.FIELD_NAME.equals(token) && "artist_name".equals(parser.getCurrentName())) {
                        token = parser.nextToken();
                        System.out.println("; Artis Name: "+ parser.getText());
                    }
                    
 
                }
            }
        }
	}
}
