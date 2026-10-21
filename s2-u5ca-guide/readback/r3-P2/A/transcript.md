# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 3. Global.cs: the file that remembers things between forms
Under the title: One file that every form can read and write.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 4. Check what your Global.cs has
Banner at the top of every screen in this part: "Part 1 of 4. You are checking your Global.cs so far"

### Screen ch03#1-1. Check what your Global.cs already has
Your project may have Global.cs already, so this screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] In Solution Explorer, is there a file called Global.cs?
    How: Solution Explorer is on the right. Look down its list of files.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Double-click Global.cs. Does it say public class Global?
    How: Look at the top of the file, a few lines down.
    If not: Go to part 2, screen 3.  [button: Go there ›]
  [tick box] Is there a public static line for surname, attempt1, quizScore and the eleven others?
    How: All fourteen names are on part 3. Check each one.
    If not: Go to part 3.  [button: Go there ›]
  [tick box] Click the Build menu, then Build Solution. Does the bottom bar say Build succeeded?
    How: The Build menu is along the top of Visual Studio.
    If not: Go to chapter 0, part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 4. Add the Global.cs file
Banner at the top of every screen in this part: "Part 2 of 4. You are making the Global.cs file"

### Screen ch03#2-0. Add a file called Global.cs that every form can read
[Opening screen of this part, one card]
A form forgets everything when it closes. Global.cs never closes, so it keeps what every form needs.
When it works, Global.cs sits in Solution Explorer. Its first line says public class Global.
[Big button at the foot: Next ›]

### Screen ch03#2-1. Meet the three new words
This chapter uses three new words, and this screen says what each one means.
Three new words in this chapter. Click any marked word to see what it means.
  Global = The file every form can read and write in.
  variable = A name that holds one thing, like a score.
  static = There is only one of it. Every form sees the same one.
Line above the big button: Done when you have read what Global, variable and static mean
[Big button at the foot: Next ›]

### Screen ch03#2-2. See why the score goes into Global.cs
A form forgets everything when it closes, so the quiz score would be gone with it.
[Animated picture: The quiz form fades away. Its score card drops into Global.cs, which keeps it.]  Caption: The quiz form closes. Its score drops into Global.cs, and Global.cs keeps it.
Global is that file. It is called Global.cs.
Each line in it is a variable. static means there is only one, shared by every form.
Watch out Global.cs holds no controls. It has no Design tab. It is only code.
Line above the big button: Done when you have looked at the picture and read the two lines under it
[Big button at the foot: Next ›]

### Screen ch03#2-3. Add Global.cs to your project
Visual Studio makes the new file for you, and you change one word in it.
STEP 1. Click the Project menu along the top. Click Add Class.
  You should see: A box opens with Class picked in its list.
  If it goes wrong I cannot see Add Class. -> Click your project's name in Solution Explorer first. Then open the Project menu again.
STEP 2. In the Name box at the bottom, type Global.cs. Click Add.
  You should see: Global.cs opens in the code tab. It says class Global.
STEP 3. Click in front of the word class. Type the word public and a space.
  You should see: The line now says public class Global.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Add a class called Global]
    picture 1: Open the Project menu. Click Add Class.
    picture 2: Class is picked. Type Global.cs in the Name box.
    picture 3: Click Add. Global.cs opens in the code tab.
Watch out Type public in front of class. Without it, your other forms may not find Global.
Line above the big button: Done when the line at the top of Global.cs says public class Global
[Big button at the foot: I've done this ✓]

## Part 3 of 4. The fourteen variables
Banner at the top of every screen in this part: "Part 3 of 4. You are making the fourteen variables"

### Screen ch03#3-0. Type the fourteen variables into Global.cs
[Opening screen of this part, one card]
The lines come in three groups: the details, the attempts, then the quiz, test and group.
When it works, Global.cs has fourteen lines that all start public static. The project builds.
[Big button at the foot: Next ›]

### Screen ch03#3-1. Keep the pupil's details in Global.cs
Every line in Global.cs has the same shape, so this screen explains it once.
public means every form may use it. static means there is only one. string means words.
[CODE CARD. Type this. Global.cs: code 1 of 3]
  Where: between the curly brackets of public class Global, in Global.cs
          public static string surname = "";
          public static string firstname = "";
          public static string yearGroup = "";
          public static string gender = "";
  [Line 1] The shape of every line: public static, then the kind, then the name. = "" means it starts empty.
  [Lines 2 to 4] Three more for the pupil: The first name, the year group and the gender. Each one is words, so each is a string.
  [Names in this code: Global.surname, Global.firstname, Global.yearGroup, Global.gender]  These are the names in MY example. Keep them the same, so every form can find them.
  [IntelliSense animation: typing the first letters of string and picking it from the list]
Watch out Each line ends with a semicolon. A missing one gives a red line.
Line above the big button: Done when lines 1 to 4 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch03#3-2. Keep the three attempts and their average
Next come the three attempts and their average, which are numbers, not words.
[CODE CARD. Type this. Global.cs: code 2 of 3]
  Where: under code 1, between the curly brackets of public class Global, in Global.cs
          public static int attempt1 = 0;
          public static int attempt2 = 0;
          public static int attempt3 = 0;
          public static double average = 0;
          public static bool averageCalculated = false;
  [Lines 5 to 7] The three attempts: Each attempt is a whole number, so each is an int. Each starts at 0.
  [Line 8] The average: A double can have a point, like 4.5. An average often does.
  [Line 9] Is the average worked out yet?: A bool is true or false. It starts false. Chapter 5 sets it to true.
  MY three attempts are swim lengths. attempt1, attempt2 and attempt3 fit any task, so keep these names.
  [Names in this code: Global.attempt1, Global.attempt2, Global.attempt3, Global.average, Global.averageCalculated]  These are the names in MY example. Keep them the same, so every form can find them.
  [IntelliSense animation: typing the first letters of int and picking it from the list]
Watch out average is a double, not an int. An int would lose the point.
Line above the big button: Done when lines 5 to 9 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch03#3-3. Keep the quiz, the reaction test and the group
Last come the quiz, the reaction test and the group the pupil goes in.
[CODE CARD. Type this. Global.cs: code 3 of 3]
  Where: under code 2, between the curly brackets of public class Global, in Global.cs
          public static int quizScore = 0;
          public static bool quizTaken = false;
          public static int reactionTestScore = 0;
          public static bool reactionTestTaken = false;
          public static string assignedGroup = "";
  [Lines 10 to 11] The quiz: quizScore holds the score. quizTaken turns true once the quiz is done.
  [Lines 12 to 13] The reaction test: The same two again, for the reaction test.
  [Line 14] The group: assignedGroup holds the group the pupil is put in. It is words.
  [Names in this code: Global.quizScore, Global.quizTaken, Global.reactionTestScore, Global.reactionTestTaken, Global.assignedGroup]  These are the names in MY example. Keep them the same, so every form can find them.
  [IntelliSense animation: typing the first letters of bool and picking it from the list]
That makes fourteen lines. Count yours.
Line above the big button: Done when all fourteen lines are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 4. Try it
Banner at the top of every screen in this part: "Part 4 of 4. You are testing your Global.cs"

### Screen ch03#4-1. Check every form can find your fourteen variables
These checks happen in Visual Studio, so the program does not need to run.
[List of checks: Try it]  Try each row in Visual Studio. You do not run the program. Tick each row that works. A row that fails tells you where to go.
  [tick box] Must happen. Click the Build menu, then Build Solution.
    How: The bottom bar says Build succeeded.
    If not: Look at the line with the red mark. Then go to part 3.  [button: Go there ›]
  [tick box] Must happen. Double-click the Login button on YOUR login form. Click an empty line in its code. Type Global and a full stop.
    How: A list pops up with YOUR fourteen names in it. Then delete what you typed.
    If not: Check each line starts public static. Go to part 3.  [button: Go there ›]
  [tick box] Must NOT happen. Take the word static off one line and build. Type Global and a full stop again.
    How: That name must NOT be in the list. Put static back afterwards.
    If not: If the name is still there, build again first. Then look at part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 3 is done ✓]

# Chapter 4. Pupil details: the Enter button
Under the title: Check the four boxes, keep them in Global.cs, switch off the panel.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 4. Check what your Enter button has
Banner at the top of every screen in this part: "Part 1 of 4. You are checking your Enter button so far"

### Screen ch04#1-1. Check what your Enter button already does
Your Enter button may already have some code, so this screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] In the Design tab, double-click the Enter button. Is there code between its curly brackets?
    How: The code tab opens at btnEnter_Click. Lines between the curly brackets mean yes.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Does the first line inside it start with the words string errors?
    How: Look at the line straight after the first curly bracket.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Run it. Leave every box empty and press Enter. Does one message list what is missing?
    How: Use the green Start arrow. Log in first, then press Enter.
    If not: Go to part 3.  [button: Go there ›]
  [tick box] Fill in all four and press Enter. Does the details panel go grey and the attempts panel wake up?
    How: Grey means switched off. Its boxes cannot be clicked.
    If not: Go to part 3, screen 4.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 4. Collect every problem
Banner at the top of every screen in this part: "Part 2 of 4. You are making the four checks"

### Screen ch04#2-0. Make the Enter button check the four boxes
[Opening screen of this part, one card]
The Enter button looks at each box in turn. Every problem it finds is added to the end of errors.
When it works, errors holds one line for every box that is wrong. Nothing is shown yet.
[Big button at the foot: Next ›]

### Screen ch04#2-1. Open the code behind the Enter button
The Enter button checks four things, and a pupil could get several of them wrong.
So the code collects every problem first. Then it shows them all in one message.
Six new things in this chapter. Click any marked word to see what it means.
  string.IsNullOrWhiteSpace = Is this box empty, or only spaces?
  || = Or. Only one side needs to be true.
  += = Add this on to the end.
  \n = Start a new line.
  .SelectedIndex == -1 = Nothing is chosen in the drop-down list yet.
  Enabled = false = Switch it off. It goes grey and cannot be clicked.
STEP 1. In the Design tab, double-click the Enter button.
  You should see: The code tab opens at btnEnter_Click.
Line above the big button: Done when the code tab is open at btnEnter_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch04#2-2. Start an empty list of problems
The first line of code makes errors, an empty string that every check adds to.
[CODE CARD. Type this. The Enter button: code 1 of 6]
  Where: between the curly brackets of btnEnter_Click, in frmDataEntry.cs
  [grey, already there] private void btnEnter_Click(object sender, EventArgs e)
  [grey, already there] {
      string errors = "";
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] An empty list of problems: errors holds words. It starts with nothing in it. Each problem found is added to it.
  [Names in this code: errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of string and picking it from the list]
Watch out The errors line goes first. Every check below adds to it.
Line above the big button: Done when lines 1 to 4 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch04#2-3. Add a problem when a name box is empty
The first check asks: is either name box empty?
string.IsNullOrWhiteSpace asks if a box is empty or holds only spaces. || means or.
+= adds a line on to the end of errors. \n starts that line on a new line.
[CODE CARD. Type this. The Enter button: code 2 of 6]
  Where: under code 1, inside btnEnter_Click, in frmDataEntry.cs
      if (string.IsNullOrWhiteSpace(tbxSurname.Text) || string.IsNullOrWhiteSpace(tbxFirstName.Text))
      {
          //displays error message if surname or forename textboxes are left blank
          errors += "\nYou must enter a surname and forename";
      }
  [Lines 5 to 6] Is a name box empty?: Is the surname box empty, OR is the first name box empty?
  [Lines 7 to 9] Add the problem: A note for you, then a new line is added to errors.
  [Names in this code: tbxSurname, tbxFirstName, errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxSurname and picking it from the list]
Watch out Two straight lines make or. The key is next to Z on most keyboards. Hold Shift.
Line above the big button: Done when lines 5 to 9 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch04#2-4. Add a problem for long names or empty lists
Two more checks come next: a name too long, and a list with nothing chosen.
.SelectedIndex == -1 asks if nothing is chosen. -1 means nothing is chosen yet.
[CODE CARD. Type this. The Enter button: code 3 of 6]
  Where: under code 2, inside btnEnter_Click, in frmDataEntry.cs
      if (tbxSurname.Text.Length > 20 || tbxFirstName.Text.Length > 20)
      {
          errors += "\nSurname and/or forename is too long";
      }
      if (cbxYeargroup.SelectedIndex == -1 || cbxGender.SelectedIndex == -1)
      {
          //displays error message if an option is nt selected in the gender or yeargroup comboboxes
          errors += "\nYou must select a gender and yeargroup";
      }
  [Lines 10 to 13] Too long?: Is either name more than 20 letters? If so, add a line to errors.
  [Lines 14 to 18] Nothing chosen?: Is nothing chosen for year group OR gender? A note, then a line is added.
  MY longest name is 20 letters. Use the number YOUR task sheet gives.
  [Names in this code: tbxSurname, tbxFirstName, cbxYeargroup, cbxGender, errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxYeargroup and picking it from the list]
Watch out Leave the spelling mistakes in the notes. The computer skips notes.
Line above the big button: Done when lines 10 to 18 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 3 of 4. Show the problems or keep the details
Banner at the top of every screen in this part: "Part 3 of 4. You are making the message and the switch"

### Screen ch04#3-0. Show the problems, or keep the details and move on
[Opening screen of this part, one card]
If errors holds anything, one message box shows it all. Otherwise the four details go into Global.cs.
When it works, a wrong form shows one message. A right form goes grey and the attempts panel wakes up.
[Big button at the foot: Next ›]

### Screen ch04#3-1. Show every problem in one message
Every check is done now, so if errors holds anything there was a problem.
errors.Length counts its characters. More than 0 means something was added.
[CODE CARD. Type this. The Enter button: code 4 of 6]
  Where: under code 3, inside btnEnter_Click, in frmDataEntry.cs
      if (errors.Length > 0)
      {
          MessageBox.Show(errors);
      }
  [Lines 19 to 22] Any problems? Show them: If errors is not empty, a message box shows every line in it.
  [Names in this code: errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of string and picking it from the list]
Watch out There is one message box, not three. It shows every problem at once.
Line above the big button: Done when lines 19 to 22 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch04#3-2. Keep the four details in Global.cs
else runs when errors is empty, which means every box was filled in right.
So the four details are kept in Global.cs. That is the file you made in chapter 3. Every form can read it.
[CODE CARD. Type this. The Enter button: code 5 of 6]
  Where: under code 4, inside btnEnter_Click, in frmDataEntry.cs
      else
      {
          //disables details panel and enables quiz result panel
          Global.surname = tbxSurname.Text;
          Global.firstname = tbxFirstName.Text;
          Global.gender = cbxGender.SelectedItem.ToString();
          Global.yearGroup = cbxYeargroup.SelectedItem.ToString();
  [Lines 23 to 25] No problems: else, then a note for you.
  [Lines 26 to 29] Keep the four details: Each one goes into its line in Global.cs.
  [Names in this code: Global.surname, tbxSurname, Global.firstname, tbxFirstName, Global.gender, cbxGender, Global.yearGroup, cbxYeargroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.surname and picking it from the list]
Watch out else opens with a curly bracket here. Its closing curly bracket comes in code 6.
Line above the big button: Done when lines 23 to 29 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch04#3-3. See which panels switch when Enter is pressed
Last, the Enter button moves the pupil on to the attempts panel.
[Animated diagram of frmDataEntry. Panels switched on: pnlPupilDetails. Then pnlSwimLengths switches on.]
  Caption first: The details are filled in right. Enter is pressed.
  Caption: The details panel goes grey. The attempts panel wakes up.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have watched the panels switch and read the line under the picture
[Big button at the foot: I've done this ✓]

### Screen ch04#3-4. Switch the panels over in code
Enabled = false switches a panel off, and Enabled = true switches it on.
[CODE CARD. Type this. The Enter button: code 6 of 6]
  Where: under code 5, inside the else of btnEnter_Click
          pnlSwimLengths.Enabled = true; //this was changed
          pnlPupilDetails.Enabled = false;
  [grey, already there]     }
  [grey, already there] 
  [grey, already there] }
  [Lines 30 to 31] Move to the next panel: The attempts panel switches on. The details panel switches off.
  [Lines 32 to 34] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlSwimLengths, pnlPupilDetails]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlSwimLengths and picking it from the list]
Line above the big button: Done when lines 30 and 31 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 4. Try your Enter button
Banner at the top of every screen in this part: "Part 4 of 4. You are testing your Enter button"

### Screen ch04#4-1. Try every way through the Enter button
Run your program, log in, then try each row and follow any failed row's link.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Leave every box empty and press Enter.
    How: One message lists every missing thing, each on its own line.
    If not: Look at the code on screens 2-3 and 2-4.  [button: Go there ›]
  [tick box] Must happen. Type a surname of 21 letters. Fill in the rest. Press Enter.
    How: The message says the name is too long.
    If not: Look at the code on screen 2-4.  [button: Go there ›]
  [tick box] Must happen. Fill in all four and press Enter.
    How: The details panel goes grey. The attempts panel can be clicked.
    If not: Look at the code on screen 3-4.  [button: Go there ›]
  [tick box] Must NOT happen. After that, click in the surname box and try to type.
    How: You must NOT be able to type in it.
    If not: If you can, look at the code on screen 3-4.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 4 is done ✓]

# Chapter 5. The average of three attempts
Under the title: Three numbers in, one average out, kept in Global.cs.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 4. Check what your average button has
Banner at the top of every screen in this part: "Part 1 of 4. You are checking your average button so far"

### Screen ch05#1-1. Check what your average button already does
Your average button may already have some code, so this screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] In the Design tab, double-click the average button. Is there code between its curly brackets?
    How: The code tab opens at btnCalculateAverage_Click. Lines between the curly brackets mean yes.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Run it. Type letters in an attempt box and press the button. Does a number only message appear?
    How: Use the green Start arrow. Log in and fill in the details first.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Type 5, 6 and 7 and press the button. Does 6 appear and the quiz panel switch on?
    How: The average shows in the box beside the button.
    If not: Go to part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 4. Check the three boxes
Banner at the top of every screen in this part: "Part 2 of 4. You are making the three checks"

### Screen ch05#2-0. Make the average button check the three boxes
[Opening screen of this part, one card]
Each box is checked for being empty, then for holding a letter. A failed check turns passValidation false.
When it works, letters in a box bring a numbers only message. The three boxes are emptied.
[Big button at the foot: Next ›]

### Screen ch05#2-1. Open the code behind the average button
The average button checks the three attempt boxes before it adds them up.
It starts by saying every box is right. Any check that fails changes that to wrong.
Six new things in this chapter. Click any marked word to see what it means.
  ! = Not. It turns true into false.
  .All(char.IsDigit) = Is every character a number from 0 to 9?
  Convert.ToDouble = Turn the words in a box into a number with a point.
  Math.Round(x, 2) = Cut a number down to 2 numbers after the point.
  .ToString() = Turn a number back into words, so a box can show it.
  Convert.ToInt32 = Turn the words in a box into a whole number.
STEP 1. In the Design tab, double-click the average button.
  You should see: The code tab opens at btnCalculateAverage_Click.
Line above the big button: Done when the code tab is open at btnCalculateAverage_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch05#2-2. Start by saying every box is right
The first line of code makes passValidation, a bool that starts true.
[CODE CARD. Type this. The average button: code 1 of 8]
  Where: between the curly brackets of btnCalculateAverage_Click
  [grey, already there] private void btnCalculateAverage_Click(object sender, EventArgs e)
  [grey, already there] {
      bool passValidation = true;
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] Trust the boxes: passValidation means did every box pass? It is a bool, true or false. It starts true.
  [Names in this code: passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of bool and picking it from the list]
Watch out passValidation starts true. Only a failed check turns it false.
Line above the big button: Done when lines 1 to 4 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch05#2-3. Turn passValidation false when a box is empty
The first check asks: is any of the three boxes empty?
It is the same question as on the Enter button, asked three times. Two straight lines mean or.
[CODE CARD. Type this. The average button: code 2 of 8]
  Where: under code 1, inside btnCalculateAverage_Click
      if (string.IsNullOrWhiteSpace(tbxAttempt1.Text) || string.IsNullOrWhiteSpace(tbxAttempt2.Text) || string.IsNullOrWhiteSpace(tbxAttempt3.Text))
      {
          passValidation = false;
      }
  
  [Line 5] Is a box empty?: Is attempt 1 empty, OR attempt 2, OR attempt 3? It is all one line.
  [Lines 6 to 9] Then do not trust them: passValidation becomes false.
  [Names in this code: tbxAttempt1, tbxAttempt2, tbxAttempt3, passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt1 and picking it from the list]
Watch out Type the question as one long line. Visual Studio wraps it for you.
Line above the big button: Done when lines 5 to 9 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch05#2-4. Turn passValidation false when attempt 1 holds a letter
The next check asks: does a box hold anything that is not a number?
.All(char.IsDigit) asks if every character is a number. ! in front turns the answer round.
So the question means: is it NOT all numbers?
[CODE CARD. Type this. The average button: code 3 of 8]
  Where: under code 2, inside btnCalculateAverage_Click
      if (!tbxAttempt1.Text.All(char.IsDigit))
      {
          passValidation = false;
      }
  
  [Line 10] Attempt 1 not all numbers?: Is the first box NOT all numbers?
  [Lines 11 to 14] Then do not trust them: passValidation becomes false.
  [Names in this code: tbxAttempt1, passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt1 and picking it from the list]
Watch out The ! goes straight in front of the box name. There is no space.
Line above the big button: Done when lines 10 to 14 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch05#2-5. Do the same check for attempts 2 and 3
Now the same check for the other two boxes, where only the box name changes.
[CODE CARD. Type this. The average button: code 4 of 8]
  Where: under code 3, inside btnCalculateAverage_Click
      if (!tbxAttempt2.Text.All(char.IsDigit))
      {
          passValidation = false;
      }
  
      if (!tbxAttempt3.Text.All(char.IsDigit))
      {
          passValidation = false;
      }
  
  [Lines 15 to 19] Attempt 2 not all numbers?: The same check for the second box.
  [Lines 20 to 24] Attempt 3 not all numbers?: The same check for the third box.
  [Names in this code: tbxAttempt2, tbxAttempt3, passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt2 and picking it from the list]
Watch out Each check names a different box. Check you changed the 1 to 2, then to 3.
Line above the big button: Done when lines 15 to 24 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch05#2-6. Show a message if a check failed
Every check is done now, so if passValidation is false something was wrong.
[CODE CARD. Type this. The average button: code 5 of 8]
  Where: under code 4, inside btnCalculateAverage_Click
      if (passValidation == false)
      {
          MessageBox.Show("Ensure all entries are present and are number only");
          tbxAttempt1.Clear();
          tbxAttempt2.Clear();
          tbxAttempt3.Clear();
      }
  [Lines 25 to 26] Did a check fail?: Is passValidation false?
  [Lines 27 to 31] Say so and empty the boxes: A message box asks for numbers only. The three boxes are emptied.
  [Names in this code: passValidation, tbxAttempt1, tbxAttempt2, tbxAttempt3]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt3 and picking it from the list]
Watch out Two equals signs ask a question. One equals sign would change passValidation.
Line above the big button: Done when lines 25 to 31 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 3 of 4. Work out the average
Banner at the top of every screen in this part: "Part 3 of 4. You are making the average"

### Screen ch05#3-0. Work out the average and move on to the quiz
[Opening screen of this part, one card]
else runs only when every box held a number. The average is rounded, kept, and shown in its box.
When it works, 5, 6 and 7 show 6 in the box. The quiz panel switches on.
[Big button at the foot: Next ›]

### Screen ch05#3-1. Add the three attempts, divide by 3 and round
else runs when every box held a number, so now the average is worked out.
A box holds words. Convert.ToDouble turns them into a number that can have a point.
Math.Round(x, 2) keeps 2 numbers after the point. .ToString() turns the number back into words for the box.
[CODE CARD. Type this. The average button: code 6 of 8]
  Where: under code 5, inside the else
      else
      {
          double average = (Convert.ToDouble(tbxAttempt1.Text) + Convert.ToDouble(tbxAttempt2.Text) + Convert.ToDouble(tbxAttempt3.Text)) / 3;
          double roundedAv = Math.Round(average, 2);
  
          Global.average = roundedAv;
          tbxCalculateAverage.Text = Global.average.ToString();
  
  [Lines 32 to 34] Add and divide: else, then the three attempts are added and divided by 3. It is all one line.
  [Lines 35 to 36] Round it: roundedAv keeps 2 numbers after the point.
  [Lines 37 to 39] Keep it and show it: The average goes into Global.cs, the file you made in chapter 3. Then the box beside the button shows it.
  [Names in this code: average, tbxAttempt1, tbxAttempt2, tbxAttempt3, roundedAv, Global.average, tbxCalculateAverage]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of double and picking it from the list]
Watch out The brackets round the three numbers matter. Without them only the last one is divided by 3.
Line above the big button: Done when lines 32 to 39 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch05#3-2. Keep the three attempts in Global.cs
Next, the average button notes the average is done and keeps the three attempts in Global.cs.
Convert.ToInt32 turns the words in a box into a whole number.
[CODE CARD. Type this. The average button: code 7 of 8]
  Where: under code 6, inside the else
          Global.averageCalculated = true;
          pnlSwimLengths.Enabled = false;
  
          Global.attempt1 = Convert.ToInt32(tbxAttempt1.Text);
          Global.attempt2 = Convert.ToInt32(tbxAttempt2.Text);
          Global.attempt3 = Convert.ToInt32(tbxAttempt3.Text);
  
  [Lines 40 to 42] Worked out. Switch off this panel: averageCalculated becomes true. The attempts panel switches off.
  [Lines 43 to 46] Keep the three attempts: Each attempt goes into its line in Global.cs as a whole number.
  [Names in this code: Global.averageCalculated, pnlSwimLengths, Global.attempt1, tbxAttempt1, Global.attempt2, tbxAttempt2, Global.attempt3, tbxAttempt3]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.attempt1 and picking it from the list]
Watch out else opens with a curly bracket. Its closing curly bracket comes in code 8.
Line above the big button: Done when lines 40 to 46 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch05#3-3. See the quiz panel switch on
Last, the average button moves the pupil on to the quiz.
[Animated diagram of frmDataEntry. Panels switched on: pnlSwimLengths. Then pnlQuizResult switches on.]
  Caption first: The average is worked out. The button is pressed.
  Caption: The attempts panel goes grey. The quiz panel wakes up.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have watched the panels switch and read the line under the picture
[Big button at the foot: I've done this ✓]

### Screen ch05#3-4. Switch the panels over in code
The last lines switch the attempts panel off and the quiz panel on.
[CODE CARD. Type this. The average button: code 8 of 8]
  Where: under code 7, inside the else
          pnlQuizResult.Enabled = true;
  
  [grey, already there]     }
  [grey, already there] }
  [Lines 47 to 48] Switch on the quiz panel: The quiz panel can now be clicked.
  [Lines 49 to 50] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlQuizResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlQuizResult and picking it from the list]
Line above the big button: Done when lines 47 to 50 are in place and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 4. Try your average button
Banner at the top of every screen in this part: "Part 4 of 4. You are testing your average button"

### Screen ch05#4-1. Try every way through the average button
Run your program, log in, fill in the details, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type a letter in one attempt box. Fill in the rest. Press the average button.
    How: A message asks for numbers only. The three boxes are empty.
    If not: Look at the code on screens 2-4 to 2-6.  [button: Go there ›]
  [tick box] Must happen. Type 5, 6 and 7. Press the average button.
    How: The box beside the button shows 6.
    If not: Look at the code on screen 3-1.  [button: Go there ›]
  [tick box] Must happen. Run it again. Type 5, 6 and 8. Press the average button.
    How: The box shows 6.33.
    If not: Look at the rounding in the code on screen 3-1.  [button: Go there ›]
  [tick box] Must NOT happen. After the average appears, click in an attempt box and try to type.
    How: You must NOT be able to type in it.
    If not: If you can, look at the code on screen 3-2.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 5 is done ✓]
