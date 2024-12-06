import { collection,addDoc,updateDoc,doc,getDocs, query, where, DocumentData, deleteDoc,orderBy, getDoc} from "firebase/firestore";
import { db } from "./firebase-service";

type ContactMutation = {
    id?: string;
    first?: string;
    last?: string;
    avatar?: string;
    twitter?: string;
    notes?: string;
    favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
    id: string;
    createdAt: string;
};

export async function getAllData():Promise<ContactRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // find
    const documentRef = collection(db,"member");
    const q = query(documentRef,orderBy("createdAt","desc"));
    const docSnapshot = await getDocs(q);

    // arrange data
    let alldata: ContactRecord[] = [];
    let firestoredata: DocumentData[] =[];

    // push data from firestore
    docSnapshot.forEach((doc) => {
        firestoredata.push(doc.data());        
    })

    // push data to Promise ContactRecord
    firestoredata.forEach((d)=>{
        alldata.push({
            id: d.id,
            createdAt: d.createdAt,
            first: d.first,
            last: d.last,
            avatar: d.avatar,
            twitter: d.twitter,
            notes: d.notes,
            favorite: d.favorite,
        });
    })
    
    // return result
    return alldata;
    
}

export async function getSingleData(id:string): Promise<ContactRecord | null> {
    
    // find
    const find = await getData("id",id);

    // get data
    const docRef = doc(db, "member", find);
    const docSnapshot = await getDoc(docRef);

    // if document exists
    if (docSnapshot.exists()) {
        
        // arrange
        let d = docSnapshot.data();
        let result: ContactRecord = {
            id: d.id,
            createdAt: d.createdAt,
            first: d.first,
            last: d.last,
            avatar: d.avatar,
            twitter: d.twitter,
            notes: d.notes,
            favorite: d.favorite,
        };
        return result;

    } else {
        return null;
    }

}
  
export async function createData(values: ContactMutation) {

    // get data
    const dataUpload = {...values}
    const docRef = await addDoc(collection(db, "member"),dataUpload);
    return docRef.id;

}

export async function updateData(id:string,values:ContactMutation)
{

    // find from id
    const find = await getData("id",id);

    // Update document
    const dataUpload = {...values}
    const docRef = await updateDoc(doc(db,"member",find),dataUpload);
    return docRef;
}

export async function deleteData(id:string) {

    // find id
    const find = await getData("id",id);

    // delete doc
    const del = await deleteDoc(doc(db,"member",find));
    
}

async function getData(target:string,values:any) {
    
    // find
    const documentRef = collection(db,"member");
    const q = query(documentRef,where(target,"==",values));
    const docSnapshot = await getDocs(q);
    let foundid = "";

    // arrange data
    docSnapshot.forEach((doc) => {
        foundid = doc.id;        
    })

    // return response
    return foundid;

}
