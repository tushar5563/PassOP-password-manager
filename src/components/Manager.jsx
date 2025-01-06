import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast, Bounce, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "", id: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const getPasswords=async()=>{
    let req= await fetch("http://localhost:3000/")
    let passwords = await req.json() 
    console.log(passwords)  
      setPasswordArray(passwords);

    
  }

  useEffect(() => {
    getPasswords()
  
  }, []);

  const copyText = (text) => {
    toast("Copied to Clipboard", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Flip,
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    if (ref.current.src.includes("icons/eye-cross.png")) {
      ref.current.src = "icons/eye.png";
      passwordRef.current.type = "password";
    } else {
      ref.current.src = "icons/eye-cross.png";
      passwordRef.current.type = "text";
    }
  };

  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
       await fetch("http://localhost:3000/",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:form.id })})
      setPasswordArray([...passwordArray,{...form,id:uuidv4() }]);
      await fetch("http://localhost:3000/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,id:uuidv4() })})
      //localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
      console.log([...passwordArray,form])
      setForm({ site: "", username: "", password: "", id: "" });
      toast("Password Saved", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    } else {
      toast("Error: Password Not Saved!");
    }
  };

  const deletePassword = async(id) => {
    console.log("Deleting password with id", id);
    let c = confirm("Do You Really Want To Delete The Password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      //localStorage.setItem("passwords", JSON.stringify(passwordArray.filter((item) => item.id !== id)));
      let res= await fetch("http://localhost:3000/",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id })})

      toast("Password Deleted Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    }
  };

  const editPassword = (id) => {
    console.log("Editing password with id", id);
  setForm({...passwordArray.filter(i=>i.id===id)[0],id:id})
  setPasswordArray(passwordArray.filter(item=>item.id!==id))
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="absolute inset-0 -z-10 min-h-screen h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="p-2 md:p-0 md:mycontainer min-h-screen h-full">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-700">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">Your Own Password Manager</p>
        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website Url"
            className="rounded-full border border-green-600 w-full px-4 py-1"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full gap-8 justify-between">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter a Username"
              className="rounded-full border border-green-600 w-full px-4 py-1"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-600 w-full px-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute right-[1px] top-[9px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="icons/eye.png"
                  alt="eye"
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="text-black flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/sbnjyzil.json"
              trigger="hover"
              stroke="bold"
              state="hover-swirl"
            ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-2">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No Passwords To Show</div>}
          {passwordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-white text-center">
                        <div className="flex justify-center items-center">
                          <a
                            href={item.site}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.site}
                          </a>
                          <div
                            className="lordiconcopy size-7 cursor-pointer mx-2"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <img
                              src="https://img.icons8.com/?size=100&id=86206&format=png&color=000000"
                              className="w-4 h-4 pt-1"
                              alt="copy icon"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex justify-center items-center">
                          <span>{item.username}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer mx-2"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <img
                              src="https://img.icons8.com/?size=100&id=86206&format=png&color=000000"
                              className="w-4 h-4 pt-1"
                              alt="copy icon"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex justify-center items-center">
                        <span>{item.password ? "#%".repeat(item.password.length) : "No password"}</span>

                          <div
                            className="lordiconcopy size-7 cursor-pointer mx-2"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <img
                              src="https://img.icons8.com/?size=100&id=86206&format=png&color=000000"
                              className="w-4 h-4 pt-1"
                              alt="copy icon"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id); }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/exymduqj.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span className="cursor-pointer mx-2" onClick={() => { deletePassword(item.id); }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/hwjcdycb.json"
                            trigger="in"
                            delay="1500"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
