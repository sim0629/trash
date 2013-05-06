import java.io.*;
import java.util.*;

public class rollingblock {
	
	public static String level;
	
	public static HashMap<Coordinate,String> root = new HashMap<Coordinate,String>();
	public static HashMap<Coordinate,Character> map = new HashMap<Coordinate,Character>();
	public static Queue<Coordinate> visiting = new LinkedList<Coordinate>();	
	
	public static int start_row,start_col,target_row,target_col;
	
	Coordinate.State state;
	
    public static void main(String str[]) throws FileNotFoundException, IOException 
	   { 
	      Scanner scan = new Scanner(System.in);
	      System.out.print("level? (ex:level1.txt , level2.txt ....) : "); 
	      level = scan.next();
	      checkstart(level);
	      System.out.println(printpath());
       }
	
	//printpath 는 그냥 nextstep을 target 발견할때까지 돌리는 함수
	
	public static String printpath()
	{
		Coordinate rooop = visiting.remove();   
		Coordinate start = new Coordinate(start_row,start_col); 
		Coordinate target = new Coordinate(target_row,target_col);
		while(true)
		{
			if(target.equals(rooop))
				break;
			else
			{
				nextstep(rooop);
				rooop = visiting.remove();
			}
			
		}
		
		return root.get(new Coordinate(target_row,target_col,Coordinate.State.S));
	}
	
	//시작점 찾아내서 다른애한테 넘겨주는애
	
	public static void checkstart(String level) throws IOException,FileNotFoundException
	{
		FileReader fr = new FileReader(level);
		int tile;	
		int row=0, col=0;
		char chartile;
		
		while(true)
		{
			tile = fr.read();
			if(tile == -1)
				break;
			
			else if((char) tile == '\n')
			{
				row++;
				col = 0;
				
			}
			else if((char) tile == '\r')
			{
			}
			else if((char) tile == 'S')
			{
				visiting.add(new Coordinate(row,col,Coordinate.State.S));
				root.put(new Coordinate(row,col,Coordinate.State.S),"");
				map.put(new Coordinate(row,col), 'o');
				start_row = row;
				start_col = col;
				col++;
				
			}
			else if((char) tile == 'T')
			{
				map.put(new Coordinate(row,col), 'o');
				target_row = row;
				target_col = col;
				col++;
			}
			else 
			{
				
				map.put(new Coordinate(row,col), (char) tile);
				col++;
				
			}
		
		}
		
		
	}
	
	
	
	public static void nextstep(Coordinate key)
	{
		int x = key.getX();
		int y = key.getY();
		
		String s = root.get(key);
				
		int chkU1 = x - 1;
		int chkU2 = x - 2;
		int chkL1 = y - 1;
	    int chkL2 = y - 2;
	    int chkD1 = x + 1;
		int chkD2 = x + 2;
		int chkR1 = y + 1;
	    int chkR2 = y + 2;

		Coordinate.State state = key.getState();
		
	
		
		
		if(state == Coordinate.State.S)
		
		{
			if(map.containsKey(new Coordinate(chkU1,y)) && map.containsKey(new Coordinate(chkU2,y)) 
					&& map.get(new Coordinate(chkU1,y)) != '-' && map.get(new Coordinate(chkU2,y)) != '-')
			{
				if(!root.containsKey(new Coordinate(chkU2,y,state.V)))
				{
					root.put(new Coordinate(chkU2,y,state.V), s + "U");
					visiting.add(new Coordinate(chkU2,y,state.V));
				}
			}
			
			if(map.containsKey(new Coordinate(x,chkL1)) && map.containsKey(new Coordinate(x,chkL2)) 
					&& map.get(new Coordinate(x,chkL1)) != '-' && map.get(new Coordinate(x,chkL2)) != '-')
			{
				if(!root.containsKey(new Coordinate(x,chkL1,state.H)))
				{
				root.put(new Coordinate(x,chkL1,state.H), s + "L");
				visiting.add(new Coordinate(x,chkL1,state.H));
				}
			}
			
			if(map.containsKey(new Coordinate(chkD1,y)) && map.containsKey(new Coordinate(chkD2,y)) 
					&& map.get(new Coordinate(chkD1,y)) != '-' && map.get(new Coordinate(chkD2,y)) != '-')
			{
				if(!root.containsKey(new Coordinate(chkD1,y,state.V)))
				{
					root.put(new Coordinate(chkD1,y,state.V), s + "D");
					visiting.add(new Coordinate(chkD1,y,state.V));
				}
			}
			
			if(map.containsKey(new Coordinate(x,chkR1)) && map.containsKey(new Coordinate(x,chkR2)) 
					&& map.get(new Coordinate(x,chkR1)) != '-' && map.get(new Coordinate(x,chkR2)) != '-')
			{
				if(!root.containsKey(new Coordinate(x,chkR2,state.H)))
				{
					root.put(new Coordinate(x,chkR2,state.H), s + "R");
					visiting.add(new Coordinate(x,chkR2,state.H));
				}
			}
		}
		
		
		else if(state == Coordinate.State.H)
		{
			
			if(map.containsKey(new Coordinate(chkU1,y)) && map.containsKey(new Coordinate(chkU1,chkL1)) 
					&& map.get(new Coordinate(chkU1,y)) != '-' && map.get(new Coordinate(chkU1,chkL1)) != '-')
			{
				if(!root.containsKey(new Coordinate(chkU1,y,state.H)))
				{
					root.put(new Coordinate(chkU1,y,state.H), s + "U");
					visiting.add(new Coordinate(chkU1,y,state.H));
				}
			}
			
			if(map.containsKey(new Coordinate(x,chkL2)) && map.get(new Coordinate(x,chkL2)) != '-' && map.get(new Coordinate(x,chkL2)) != '.')
			{
				if(!root.containsKey(new Coordinate(x,chkL2,state.S)))
				{
					root.put(new Coordinate(x,chkL2,state.S), s + "L");
					visiting.add(new Coordinate(x,chkL2,state.S));
				}
			}
			
			if(map.containsKey(new Coordinate(chkD1,y)) && map.containsKey(new Coordinate(chkD1,chkL1)) 
					&& map.get(new Coordinate(chkD1,y)) != '-' && map.get(new Coordinate(chkD1,chkL1)) != '-')
			{
				if(!root.containsKey(new Coordinate(chkD1,y,state.H)))
				{
					root.put(new Coordinate(chkD1,y,state.H), s + "D");
					visiting.add(new Coordinate(chkD1,y,state.H));
				}
			}
			
			if(map.containsKey(new Coordinate(x,chkR1)) && map.get(new Coordinate(x,chkR1)) != '-' && map.get(new Coordinate(x,chkR1)) != '.')
			{
				if(!root.containsKey(new Coordinate(x,chkR1,state.S)))
				{
					root.put(new Coordinate(x,chkR1,state.S), s + "R");
					visiting.add(new Coordinate(x,chkR1,state.S));
				}
			}
		}
		
		else if(state == Coordinate.State.V)
		{
			
			if(map.containsKey(new Coordinate(chkU1,y)) && map.get(new Coordinate(chkU1,y)) != '-' && map.get(new Coordinate(chkU1,y)) != '.')
			{
				if(!root.containsKey(new Coordinate(chkU1,y,state.S)))
				{
					root.put(new Coordinate(chkU1,y,state.S), s + "U");
					visiting.add(new Coordinate(chkU1,y,state.S));
				}
			}
			if(map.containsKey(new Coordinate(x,chkL1)) && map.containsKey(new Coordinate(chkD1,chkL1)) 
					&& map.get(new Coordinate(x,chkL1)) != '-' && map.get(new Coordinate(chkD1,chkL1)) != '-')
			{
				if(!root.containsKey(new Coordinate(x,chkL1,state.V)))
				{
					root.put(new Coordinate(x,chkL1,state.V), s + "L");
					visiting.add(new Coordinate(x,chkL1,state.V));
				}
			}
			if(map.containsKey(new Coordinate(chkD2,y)) && map.get(new Coordinate(chkD2,y)) != '-' && map.get(new Coordinate(chkD2,y)) != '.')
			{
				if(!root.containsKey(new Coordinate(chkD2,y,state.S)))
				{
					root.put(new Coordinate(chkD2,y,state.S), s + "D");
					visiting.add(new Coordinate(chkD2,y,state.S));
				}
			}
			if(map.containsKey(new Coordinate(x,chkR1)) && map.containsKey(new Coordinate(chkD1,chkR1)) 
					&& map.get(new Coordinate(x,chkR1)) != '-' && map.get(new Coordinate(chkD1,chkR1)) != '-')
			{
				if(!root.containsKey(new Coordinate(x,chkR1,state.V)))
				{
					root.put(new Coordinate(x,chkR1,state.V), s + "R");
					visiting.add(new Coordinate(x,chkR1,state.V));
				}
			}	
		}
	}
	
	
}