import { UIObject } from "./UIObject";
import { RUIEventEmitter, RUIEvent, RUIMouseEvent } from "./RUIEventSys";



if(Array.prototype['includes'] == null){
    Array.prototype['includes'] = function(o){
        if(o==null) return false; 
        let index= this.indexOf(o);
        if(index < 0) return false;
        return true;
    }
}


export class RUIQTree{

    private m_ui :UIObject;
    constructor(uiroot:UIObject){
        this.m_ui= uiroot;
    }


    public DispatchEvtMouseEvent(x:number,y:number,type:string){
        let target = this.TraversalTree(x,y);
        if(target == null) return;
        let d = target[type];
        if(d){
            (<RUIEventEmitter>d).emit(new RUIMouseEvent(target,type,x,y));
        }
    }


    private m_listHovered: UIObject[] = [];
    public DispatchEvtMouseMove(x:number,y:number){
        let curlist = this.TraversalNormalAll(x,y);
        let hovlist= this.m_listHovered;

    }



    public TraversalTree(x:number,y:number) : UIObject{
        return this.TraversalNoraml(x,y);
    }

    private TraversalNormalAll(x:number,y:number):UIObject[]{
        let list:UIObject[] = [];

        this.m_ui.execRecursive((ui)=>{
            if(ui.rectContains(x,y)){
                list.push(ui);
            }
        })

        return list;

    }

    private TraversalNoraml(x:number,y:number):UIObject{
        var tarNode: UIObject = null;
        this.m_ui.execRecursive((ui)=>{
            if(ui.rectContains(x,y)){
                if(tarNode == null){
                    tarNode = ui;
                }
                else{
                    if(ui._level >= tarNode._level) tarNode = ui;
                }
            }
        });

        return tarNode;
    }

    private TraversalQuadTree(x:number,y:number):UIObject{
        throw new Error('not implemented.');
    }
}