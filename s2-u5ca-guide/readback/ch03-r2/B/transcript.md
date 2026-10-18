# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 3. Global.cs: the file that remembers things between forms
Under the title: One file that every form can read and write.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your Global.cs has

### Screen ch03#1-1. Check what your Global.cs already has
Your project may have Global.cs already. This screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] In Solution Explorer, is there a file called Global.cs?
    How: Solution Explorer is on the right. Look down its list of files.
    If not: Go to stage 2.  [button: Go there ›]
  [tick box] Double-click Global.cs. Does it say public class Global?
    How: Look at the top of the file, a few lines down.
    If not: Go to stage 2, screen 2.  [button: Go there ›]
  [tick box] Is there a public static line for surname, attempt1, quizScore and the eleven others?
    How: All fourteen names are on stage 3. Check each one.
    If not: Go to stage 3.  [button: Go there ›]
  [tick box] Click the Build menu, then Build Solution. Does the bottom bar say Build succeeded?
    How: The Build menu is along the top of Visual Studio.
    If not: Go to chapter 0, stage 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. Add the Global.cs file

## Stage 3. The fourteen variables

### Screen ch03#3-1. Keep the pupil's details in Global.cs
Every line in Global.cs has the same shape. This screen explains it once.
public means every form may use it. static means there is only one. string means words.
[CODE CARD. Type this. Global.cs, part 1 of 3]
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
[Big button at the foot: I've done this ✓]

### Screen ch03#3-2. Keep the three attempts and their average
Next come the three attempts and their average. These are numbers, not words.
[CODE CARD. Type this. Global.cs, part 2 of 3]
  Where: under part 1, between the curly brackets of public class Global, in Global.cs
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
[Big button at the foot: I've done this ✓]

### Screen ch03#3-3. Keep the quiz, the reaction test and the group
Last come the quiz, the reaction test and the group the pupil goes in.
[CODE CARD. Type this. Global.cs, part 3 of 3]
  Where: under part 2, between the curly brackets of public class Global, in Global.cs
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
[Big button at the foot: I've done this ✓]

## Stage 4. Try it

### Screen ch03#4-1. Check every form can find your fourteen variables
These checks happen in Visual Studio. The program does not need to run.
[List of checks: Try it]  Try each row in Visual Studio. You do not run the program. Tick each row that works. A row that fails tells you where to go.
  [tick box] Must happen. Click the Build menu, then Build Solution.
    How: The bottom bar says Build succeeded.
    If not: Look at the line with the red mark. Then go to stage 3.  [button: Go there ›]
  [tick box] Must happen. Open frmLogin in the code tab. Click an empty line inside btnLogin_Click. Type Global and a full stop.
    How: A list pops up with YOUR fourteen names in it. Then delete what you typed.
    If not: Check each line starts public static. Go to stage 3.  [button: Go there ›]
  [tick box] Must NOT happen. Take the word static off one line and build. Type Global and a full stop again.
    How: That name must NOT be in the list. Put static back afterwards.
    If not: If the name is still there, build again first. Then look at stage 3.  [button: Go there ›]
[Big button at the foot: Chapter 3 is done ✓]
