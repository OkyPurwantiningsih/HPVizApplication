package jsonParser;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class SerializationExampleTreeModel {
	public static void main(String[] args) throws IOException {
        // Create the node factory that gives us nodes.
        JsonNodeFactory factory = new JsonNodeFactory(false);
 
        // create a json factory to write the treenode as json. for the example
        // we just write to console
        JsonFactory jsonFactory = new JsonFactory();
        JsonGenerator generator = jsonFactory.createGenerator(System.out);
        ObjectMapper mapper = new ObjectMapper();
 
        // the root node - album
        JsonNode album = factory.objectNode();
        
        // add album title
        ((ObjectNode)album).put("Album-Title", "Kind Of Blue");
        
        // add album links
        ArrayNode links = factory.arrayNode();
        links.add("link1").add("link2");
        ((ObjectNode)album).set("links", links);
        
        // add artist
        ObjectNode artist = factory.objectNode();
        artist.put("Artist-Name", "Miles Davis");
        artist.put("birthDate", "26 May 1926");
        ((ObjectNode)album).set("artist", artist);
        
        // add musician
        ObjectNode musicians = factory.objectNode();
        musicians.put("Julian Adderley", "Alto Saxophone");
        musicians.put("Miles Davis", "Trumpet, Band leader");
        ((ObjectNode)album).set("musicians", musicians);
        
        mapper.writeTree(generator, album);
        
        
 
    }
 
}
