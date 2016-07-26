package idv.teco.websocket;

import javax.websocket.server.ServerEndpointConfig.Configurator;

public class MyConfigurator extends Configurator {

    private WebSocketImpl webSocket = new WebSocketImpl();
   
   
   
    @Override
    public <T> T getEndpointInstance(Class<T> clazz) throws InstantiationException {
        return (T) webSocket;
    }

}