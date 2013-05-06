import java.util.HashMap;
import java.util.Map;

public class Coordinate {

    private int x;
    private int y;
    public static enum State{
        S, H, V
    };
    State state = State.S;

    public Coordinate(int x, int y){
        this.x = x;
        this.y = y;
    }

    public Coordinate(int x, int y, State state){
        this.x=x;
        this.y=y;
        this.state = state;
    }

    public void setState(State state){
        this.state =state;
    }

     
    public int getX(){
        return x;
    }

    public int getY(){
        return y;
    }

    public State getState(){
        return state;
    }
    
    public boolean equals(Object obj){
        if(obj instanceof Coordinate){
            Coordinate cor = (Coordinate) obj;
            if(cor.getX() != x) return false;
            if(cor.getY() != y) return false;
            if(cor.getState() != state) return false;
        }
        return true;
    }
    
    public int hashCode(){
      int s=0;
    	
       if(state.toString() == "S")
    	   s= (x*4817 + y*65599);
       else if(state.toString() == "H")
    	   s= (x*4817 + y*65599)+1;
       else if(state.toString() == "V")
    	   s= (x*4817 + y*65599)+2;
	return s;
       
   }

}

