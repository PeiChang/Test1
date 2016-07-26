package idv.teco.websocket;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.JSONException;
import org.json.JSONObject;

@ServerEndpoint(value = "/chat", configurator = MyConfigurator.class)
public class WebSocketImpl {
    private Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());
    protected final Logger logger = LoggerFactory.getLogger(getClass());
	
    @OnOpen
    public void onOpen(Session session) {

        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        
    }

    @OnMessage
    public void onMessage(String message, Session session) throws JSONException {
    	
    	JSONObject jObj = new JSONObject(message);

    	/* Receive music info*/
    	try {
        	String musicInfo = jObj.get("musicInfo").toString();
            for (Session s : sessions) {
                s.getAsyncRemote().sendText(musicInfo);
            }
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e.toString());
		}
    	
    	/* Receive chat info*/
    	try {
        	String msg = jObj.get("msg").toString();
        	String nickName = jObj.get("nickName").toString();
            for (Session s : sessions) {
                s.getAsyncRemote().sendText(nickName + ":" + msg);
            }
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e.toString());
		}
    	

    }
}