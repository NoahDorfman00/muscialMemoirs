function inqSubmit() {
    const elapsed = Date.now();
    const date = new Date(elapsed);

    var inq = {
      "key": String(elapsed),
      "time": date.toLocaleString('en-US', { timeZone: 'America/New_York' }),
      "name": String(document.getElementById("inqFormName").value),
      "email": String(document.getElementById("inqFormMail").value),
      "phone": String(document.getElementById("inqFormNum").value)
    }
    console.log(JSON.stringify(inq));

    var issue = false;
    if (!inq.name)
    {
      console.log("no name");
      issue = true;
      window.alert("Please enter your name!");
    }
    if (!(inq.phone || inq.email))
    {
      console.log("no email or number");
      issue = true;
      window.alert("Please enter your phone number and/or email address!");
    }

    if (!issue)
    {
      newInqRef = inqRef.push();
      newInqRef.set({
        time: inq.time,
        name: inq.name,
        email: inq.email,
        phone: inq.phone
      });
      console.log("Data set");
    }

    inqForm.reset(); 	
  }