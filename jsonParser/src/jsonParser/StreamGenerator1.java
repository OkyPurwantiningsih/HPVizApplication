package jsonParser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
 
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

public class StreamGenerator1 {
	public static void main(String[] args) throws IOException {
		JsonFactory factory = new JsonFactory();
        JsonGenerator generator = factory.createGenerator(new FileWriter(new File("albums.json")));
        
     // start writing with {
        generator.writeStartObject();
        generator.writeFieldName("title");
        generator.writeString("Free Music Archive - Albums");
        generator.writeFieldName("dataset");
        // start an array
        generator.writeStartArray();
        generator.writeStartObject();
        generator.writeStringField("album_title", "A.B.A.Y.A.M");
        generator.writeEndObject();
        generator.writeEndArray();
        
        // start writing artist
        generator.writeFieldName("artist");
        generator.writeString("Taylor Swift");
        generator.writeEndObject();
        
        generator.close();
	}
}
