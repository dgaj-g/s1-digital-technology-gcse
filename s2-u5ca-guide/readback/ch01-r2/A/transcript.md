# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 1. The login form
Under the title: Two boxes, one button, and the code that checks them.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your login form has

## Stage 2. The two boxes and the button

### Screen ch01#2-1. Put the boxes, labels and buttons on the login form
The login form holds a panel. Inside the panel are two boxes, two labels and the Login button.
The Toolbox is down the left side of Visual Studio. It lists the controls you can drag.
Drag each one from the Toolbox onto the form. Do them in the order of this table.
[Table of controls for frmLogin. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Panel | pnlLogin (the panel that holds the login boxes and button) | Nothing else to set
  Label | lblTitle (the title at the top of the login form) | Text = Login Form
  Label | lblUsername (the label beside the username box) | Text = Enter Username
  TextBox | tbxUsername (the box where the username is typed) | Nothing else to set
  Label | lblPassword (the label beside the password box) | Text = Enter Password
  TextBox | tbxPassword (the box where the password is typed) | Nothing else to set
  Button | btnLogin (the Login button) | Text = Login
  Label | lblSubtitle (the small line under the title) | Text = Swimming club records
  Button | btnHelp1 (the ? button on the login form) | Text = ?
  You should see: Two boxes, two labels and the Login button sit inside the panel. The title and the ? button are there too.
Watch out Drop the boxes, labels and the Login button INSIDE the panel. The panel then holds them.
[Big button at the foot: I've done this ✓]

### Screen ch01#2-2. Give every control its name
Every control you dragged on needs its name. The name is how your code finds it.
[Picture strip: Give a control its name]
  picture 1: Click the control once. Little squares appear round it.
  picture 2: In Properties, find the word Name. It is near the top of the list.
  picture 3: Type the new name and press Enter.
Do this for every row of the table on the screen before. Give yours the names YOU choose.
Start each name with three letters for its kind. pnl is a panel, lbl a label, tbx a text box, btn a button.
Watch out A name has no spaces. Two controls can never have the same name.
[Big button at the foot: I've done this ✓]

### Screen ch01#2-3. Make the password show stars
Nobody should see a password as it is typed. One setting in Properties turns every letter into a star.
STEP 1. In the Design tab, click the password box once.
  You should see: Little squares appear round the password box.
STEP 2. In Properties, find PasswordChar. In the box beside it, type the star sign * and press Enter.
  You should see: PasswordChar shows *.
  If it goes wrong I cannot find PasswordChar. -> The list is in A to Z order. Scroll down to the letter P.
  If it goes wrong I cannot find the star sign. -> Hold Shift and press the 8 key at the top of the keyboard.
The ? button does nothing yet. You make it work in chapter 13.
Watch out Put the star on the PASSWORD box, not the username box.
[Big button at the foot: I've done this ✓]

## Stage 3. The code behind the Login button

### Screen ch01#3-1. Stop a username that is too long
The Login button checks what was typed. First it checks that the username is not too long.
Five new things in this chapter. Click any marked word to see what it means.
  .Text = The words it shows.
  .Length = How many characters.
  == = Is the same as.
  && = And.
  this.Hide() = Hide this form but keep it.
STEP 1. In the Design tab, double-click the Login button.
  You should see: The code tab opens at btnLogin_Click, empty between the curly brackets.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: From the button to its code]
    picture 1: Double-click the Login button in the Design tab.
    picture 2: The code tab opens. Visual Studio has written btnLogin_Click for you.
.Text is what was typed in a box. .Length counts its characters. .Clear() empties a box.
[CODE CARD. Type this. The Login button, part 1 of 3]
  Where: between the curly brackets of btnLogin_Click, in frmLogin.cs
  [grey, already there] private void btnLogin_Click(object sender, EventArgs e)
  [grey, already there] {
      //checks that entered username does not exceed 15 characters
      if (tbxUsername.Text.Length > 15)
      {
          MessageBox.Show("Username has exceeded the maximum number of characters", "Please enter a username with less than 15 characters");
  
          tbxUsername.Clear();
          tbxPassword.Clear();
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Too long?: The line with two slashes is a note for you. The computer skips it. Then it asks: is the username more than 15 letters?
  [Lines 6 to 10] Say so and empty both boxes: A message box pops up and tells the user. Then both boxes are emptied.
  [Names in this code: tbxUsername, tbxPassword]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxUsername and picking it from the list]
Watch out Leave the last curly bracket of btnLogin_Click where it is. The code on the next two screens goes above it.
[Big button at the foot: I've done this ✓]

### Screen ch01#3-2. Let the right username and password in
Next the code asks: are the username and the password both right?
else if means: if the first question was no, ask this question instead.
== asks if two things are the same. && means both must be true.
[CODE CARD. Type this. The Login button, part 2 of 3]
  Where: under part 1, inside btnLogin_Click, in frmLogin.cs
  
      //if username 'jsmith' and password 'Password1' inputted, message appears, 'Login Details Correct'
      else if (tbxUsername.Text == "jsmith" && tbxPassword.Text == "Password1")
      {
          MessageBox.Show("Login details correct");
          this.Hide();
          new frmDataEntry().Show();
      }
  [Lines 11 to 14] The right details?: A note, then the question. Is the username jsmith AND is the password Password1?
  [Lines 15 to 18] Let them in: A message box says so. The login form hides. A new data entry form opens.
  MY username is jsmith and MY password is Password1. YOURS are the ones YOUR task sheet gives you.
  [Names in this code: tbxUsername, tbxPassword, frmDataEntry]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxPassword and picking it from the list]
this.Hide() hides the login form. The last line makes a new data entry form and shows it.
frmDataEntry is the data entry form. You make it in chapter 2. Until it is made, frmDataEntry has a red line under it.
Watch out Two equals signs, not one. One equals sign would try to change the box.
[Big button at the foot: I've done this ✓]

### Screen ch01#3-3. Show Login incorrect when the details are wrong
Last, the code deals with anything else. That means a wrong username or a wrong password.
[CODE CARD. Type this. The Login button, part 3 of 3]
  Where: under part 2, inside btnLogin_Click, in frmLogin.cs
  
  
      else
      {
          //If incorrect login details are entered, 'login incorrct, login unsuccessful' message appears
          MessageBox.Show("Login incorrect", "Login Unsuccessful!");
  
          tbxUsername.Clear();
          tbxPassword.Clear();
      }
  [grey, already there] }
  [Lines 19 to 23] Anything else: else catches every other case. Then a note for you.
  [Lines 24 to 28] Say so and empty both boxes: A message box says Login incorrect. Both boxes are emptied.
  [Line 29] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: tbxUsername, tbxPassword]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxUsername and picking it from the list]
Watch out The else has no question after it. It runs when the two questions above were both false.
[Big button at the foot: I've done this ✓]

## Stage 4. Try your login form

### Screen ch01#4-1. Try every way into your login form
Run your program and try each row. Tick the rows that work. A row that fails tells you where to look.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type a username of 16 letters and press Login.
    How: The message says the username has exceeded the maximum number of characters.
    If not: Look at part 1 on screen 3-1.  [button: Go there ›]
  [tick box] Must happen. Type the right username and a wrong password. Press Login.
    How: The message says Login incorrect. Both boxes are empty.
    If not: Look at part 3 on screen 3-3.  [button: Go there ›]
  [tick box] Must happen. Type the right username and password. Press Login.
    How: The login form goes and the data entry form opens.
    If not: Look at part 2 on screen 3-2.  [button: Go there ›]
  [tick box] Must NOT happen. Leave both boxes empty and press Login.
    How: The data entry form must NOT open. The Login incorrect message appears.
    If not: If the data entry form opened, look at the question in part 2 on screen 3-2.  [button: Go there ›]
[Big button at the foot: Chapter 1 is done ✓]
