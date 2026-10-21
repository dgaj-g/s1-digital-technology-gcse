# Chapter 10, work out the group (DESIGN_SPEC §9 ch10, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
G = 'CalculateGroup'
B = 'btnCalculateSwimmingGroup_Click'
IN = 'inside btnCalculateSwimmingGroup_Click'
CH = {
 "id": "10", "n": 10, "of": 15, "title": "Work out the group", "kind": "new", "color": "#3A6EA5",
 "one": "Three scores become one group, worked out by a piece of code you name yourself.",
 "prev": {"id": "09", "n": 9, "title": "The reaction test"},
 "next": {"id": "11", "n": 11, "title": "Save the details to the file"},
 "methods": [[D, G], [D, B]],
 "stages": [
  {"id": "1", "title": "Check what you need first", "thing": "the parts this chapter needs", "verb": "checking", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "Before I start, I check the Load event, the group panel, Global.cs and my task sheet.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters, so this screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Is the data entry Load event done, so the group panel switches on after the test?",
          "Run the program. Take the quiz and the test. Look at the group panel.", "Go to chapter 8.", "#cw/08/1-1"),
     have("1-1.t2", "Does the group panel have a result box and a Calculate button?",
          "Open frmDataEntry in the Design tab. Look inside the group panel.", "Go to chapter 2, part 3.", "#cw/02/3-1"),
     have("1-1.t3", "Does Global.cs have assignedGroup?",
          "Double-click Global.cs in Solution Explorer.", "Go to chapter 3, part 3.", "#cw/03/3-1"),
     have("1-1.t4", "Is YOUR task sheet open at the page with the bands and the group names?",
          "Find the page that says which scores give which group.", "Ask your teacher for the task sheet.", "#cw/00")]}
   ]}]},
  {"id": "2", "title": "Your own piece of code, with a name you choose", "thing": "CalculateGroup, your own code", "verb": "making", "screens": [
   opener("Make CalculateGroup, your own piece of code", "This part writes CalculateGroup by hand. It takes three bands in and hands one group back.",
           "Until now every piece of code came from a double-click. This one you type from its first line, and you choose its name.",
           "When it works, CalculateGroup sits at the bottom of frmDataEntry's code, 18 lines long."),
   {"id": "1", "title": "Meet the two new words", "foot": "next", "done": "you have read the two words",
    "goal": "I know what a method is and what makes one user-defined.",
    "blocks": [
    {"p": "Until now, each [[method|0]] came from double-clicking a button."},
    {"p": "This one you write by hand."},
    {"p": "You choose its name. That makes it a [[user-defined method|1]]."},
    {"words": [
      ["method", "A named piece of code that runs when it is asked to.", "2-1", False],
      ["user-defined method", "A method you write and name yourself.", "2-1", False]],
     "intro": "Two new words in this chapter. Click a marked word to see what it means."},
   ]},
   {"id": "2", "title": "See three bands go in and one group come out", "foot": "next", "done": "you have looked at the picture and read the line under it",
    "goal": "I see CalculateGroup as a machine: three bands in, one group out.",
    "blocks": [
    {"p": "Each score earns a band, a small number, as the table on your task sheet shows."},
    {"p": "This picture shows CalculateGroup at work."},
    {"drawn": {"id": "group-machine", "ins": ["3", "2", "3"], "name": "CalculateGroup", "out": "Advanced",
               "alt": "Three numbers, 3, 2 and 3, drop into a box called CalculateGroup. The word Advanced comes out.",
               "say": "Three bands go in. One group comes out."}},
    {"watch": "The button code in part 3 works out the three bands. Then it asks CalculateGroup for the group."}
   ]},
   {"id": "3", "title": "Type the first line, the total and the first group", "foot": "done", "done": "lines 1 to 8 are typed and the code has no red squiggles",
    "goal": "CalculateGroup takes in three whole numbers, adds them up, and hands back Weak when the total is 4 or less.",
    "blocks": [
    {"p": "Scroll to the bottom of frmDataEntry's code."},
    {"p": "Click the empty line above the last two curly brackets."},
    code("2-2.c1", "CalculateGroup: code 1 of 2", "above the last two curly brackets of frmDataEntry's code", D, G, 1, 8,
         [[1, 2, "The first line, typed by you", "private means only this form uses it. string means it hands back words. Then its name and three whole numbers coming in."],
          [3, 4, "Add them up", "The three numbers are added into total. Then an empty line."],
          [5, 8, "Four or less is Weak", "If the total is 4 or less, return hands back the word Weak."]],
         ["CalculateGroup", "first", "second", "third", "total"], [],
         yours="MY bands and group names come from MY task. Use the numbers and names on YOUR task sheet."),
    {"watch": "No double-click makes this first line. Type every word of it yourself."}
   ]},
   {"id": "4", "title": "Hand back the other two groups", "foot": "done", "done": "lines 9 to 18 are typed and the code has no red squiggles",
    "goal": "A total of 7 or less hands back Intermediate, and anything more hands back Advanced.",
    "blocks": [
    {"p": "Each return hands the answer back to the code that asked for it."},
    code("2-3.c1", "CalculateGroup: code 2 of 2", "under code 1, inside CalculateGroup", D, G, 9, 18,
         [[9, 12, "Seven or less is Intermediate", "Otherwise, if the total is 7 or less, hand back Intermediate."],
          [13, 16, "Anything more is Advanced", "Every other total hands back Advanced."],
          [17, 18, "Close it", "An empty line, then the curly bracket that ends CalculateGroup."]],
         ["total"], [],
         yours="MY numbers are 4 and 7, and MY groups are Weak, Intermediate and Advanced. Type the ones on YOUR task sheet.")
   ]}]},
  {"id": "3", "title": "The Calculate button", "thing": "the Calculate button", "verb": "making", "screens": [
   opener("Make the Calculate button work out the group", "This part types the Calculate button's code in seven chunks. It bands each score, then asks CalculateGroup for the group.",
           "A band is 1, 2 or 3. The quiz score, the test score and the average each get one from YOUR task sheet.",
           "When it works, Calculate shows the group in its box and the group panel goes grey."),
   {"id": "1", "title": "Stop if anything is not done yet", "foot": "done", "done": "lines 3 to 12 are typed and the code has no red squiggles",
    "goal": "If the quiz, the test or the average is not done, or the details are not entered, a message shows and the code stops.",
    "blocks": [
    {"p": "In the Design tab, double-click the Calculate button in the group panel."},
    code("3-1.c1", "The Calculate button: code 1 of 7", "between the curly brackets of " + B, D, B, 1, 12,
         [given(1, 2),
          [3, 8, "Not everything done? Stop here", "If any of the four is not done, a message shows. Then the code stops."],
          [9, 12, "Notes for you", "An empty line, then three notes about the scores. They do not run."]],
         ["Global.quizTaken", "Global.reactionTestTaken", "Global.averageCalculated", "pnlPupilDetails"], ["pnlPupilDetails"]),
    {"watch": "Line 3 is one long line. Keep it on one line in Visual Studio."}
   ]},
   {"id": "2", "title": "Make room for three bands", "foot": "done", "done": "lines 13 to 21 are typed and the code has no red squiggles",
    "goal": "When everything is done, three whole numbers start at 0, one for each band.",
    "blocks": [
    {"p": "A band is 1, 2 or 3, and each score gets one on the next screens."},
    code("3-2.c1", "The Calculate button: code 2 of 7", "under code 1, " + IN, D, B, 13, 21,
         [[13, 16, "Otherwise, carry on", "Two empty lines, then else and its curly bracket."],
          [17, 19, "Three bands to fill", "One whole number for each band. Each starts at 0."],
          [20, 21, "A note for the quiz", "An empty line, then a note. The quiz band comes next."]],
         ["quizCategory", "reactionTestCategory", "swimLengthsCategory"], [])
   ]},
   {"id": "3", "title": "Give the quiz score a band", "foot": "done", "done": "lines 22 to 33 are typed and the code has no red squiggles",
    "goal": "A quiz score of 1 or less is band 1, 3 or less is band 2, and anything more is band 3.",
    "blocks": [
    {"p": "These ifs have the same shape as CalculateGroup, but this time each answer is a band."},
    code("3-3.c1", "The Calculate button: code 3 of 7", "under code 2, " + IN, D, B, 22, 33,
         [[22, 25, "One or less is band 1", "If the quiz score is 1 or less, the quiz band is 1."],
          [26, 29, "Three or less is band 2", "Otherwise, if it is 3 or less, the quiz band is 2."],
          [30, 33, "Anything more is band 3", "Every other score makes the quiz band 3."]],
         ["Global.quizScore", "quizCategory"], [],
         yours="MY quiz is out of 5, so MY numbers are 1 and 3. YOUR task sheet gives YOURS.")
   ]},
   {"id": "4", "title": "Give the test score a band", "foot": "done", "done": "lines 34 to 43 are typed and the code has no red squiggles",
    "goal": "A test score of 1 or less is band 1, and 4 or less is band 2.",
    "blocks": [
    {"p": "The test band has the same shape, and this screen does bands 1 and 2."},
    code("3-4.c1", "The Calculate button: code 4 of 7", "under code 3, " + IN, D, B, 34, 43,
         [[34, 35, "A note for the test", "An empty line, then a note."],
          [36, 39, "One or less is band 1", "If the test score is 1 or less, the test band is 1."],
          [40, 43, "Four or less is band 2", "Otherwise, if it is 4 or less, the test band is 2."]],
         ["Global.reactionTestScore", "reactionTestCategory"], [],
         yours="MY numbers are 1 and 4. Use the numbers on YOUR task sheet.")
   ]},
   {"id": "5", "title": "Give the test score its last band", "foot": "done", "done": "lines 44 to 50 are typed and the code has no red squiggles",
    "goal": "Any other test score is band 3.",
    "blocks": [
    {"p": "These lines are the last part of the test band, then a note for the average."},
    code("3-5.c1", "The Calculate button: code 5 of 7", "under code 4, " + IN, D, B, 44, 50,
         [[44, 48, "Anything more is band 3", "Every other score makes the test band 3. An empty line sits inside."],
          [49, 50, "A note for the average", "An empty line, then a note. The average band comes next."]],
         ["reactionTestCategory"], [])
   ]},
   {"id": "6", "title": "Give the average a band", "foot": "done", "done": "lines 51 to 62 are typed and the code has no red squiggles",
    "goal": "An average under 4 is band 1, 7 or less is band 2, and anything more is band 3.",
    "blocks": [
    {"p": "Look closely at the first line: it says less than 4, not 4 or less."},
    code("3-6.c1", "The Calculate button: code 6 of 7", "under code 5, " + IN, D, B, 51, 62,
         [[51, 54, "Under 4 is band 1", "If the average is less than 4, the average band is 1."],
          [55, 58, "Seven or less is band 2", "Otherwise, if it is 7 or less, the average band is 2."],
          [59, 62, "Anything more is band 3", "Every other average makes the band 3."]],
         ["Global.average", "swimLengthsCategory"], [],
         yours="MY numbers are 4 and 7. Use the numbers on YOUR task sheet.")
   ]},
   {"id": "7", "title": "See the group panel go grey", "foot": "done", "done": "you have looked at the picture and read the line under it",
    "goal": "I see the group panel go grey after the group is worked out.",
    "blocks": [
    {"p": "After the group appears, the group panel goes grey so Calculate cannot run twice."},
    {"flow": {"watch": "Watch the group panel go grey once the group is worked out", "labels": DL, "form": D, "lit": ["pnlSwimmingGroup"], "then": [], "keep": False,
              "say": "The group panel goes grey. Save comes next."}},
   ]},
   {"id": "8", "title": "Ask for the group and grey out the panel", "foot": "done", "done": "lines 63 to 69 are typed and the code has no red squiggles",
    "goal": "CalculateGroup turns the three bands into a group, Global.cs remembers it and the group panel goes grey.",
    "blocks": [
    {"p": "These lines ask CalculateGroup for the group, save it in Global.cs and grey the panel."},
    code("3-7.c1", "The Calculate button: code 7 of 7", "under code 6, " + IN, D, B, 63, 70,
         [[63, 64, "Ask CalculateGroup", "The three bands go in. The group comes out into the box."],
          [65, 66, "Remember it, grey the panel", "Global.cs keeps the group. The group panel switches off."],
          [67, 69, "Close the else", "The end of else, then two empty lines."],
          given(70, 70)],
         ["tbxSwimmingGroup", "CalculateGroup", "reactionTestCategory", "swimLengthsCategory", "quizCategory", "Global.assignedGroup", "pnlSwimmingGroup"], ["CalculateGroup"])
   ]}]},
  {"id": "4", "title": "Try it", "thing": "your Calculate button", "verb": "testing", "screens": [
   {"id": "1", "title": "Try your Calculate button", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I run the program, do everything, and check the group, the grey panel and two sets of scores.",
    "blocks": [
    {"p": "Run your program and log in."},
    {"p": "Enter the details, the attempts, the quiz and the test, then try each row."},
    {"check": [
     tryit("4-1.t1", "Click Calculate.", "A group appears in the box. The group panel goes grey.", "Look at the code on screen 3-8.", "#cw/10/3-8"),
     tryit("4-1.t2", "Run again. Get all 5 quiz questions right. Click 6 winning pictures. Type 8, 8 and 8 as the attempts.", "Click Calculate. MY bands give Advanced. YOURS give YOUR top group.", "Look at the code on screens 3-3 to 3-6.", "#cw/10/3-3"),
     tryit("4-1.t3", "Run again. Get 1 quiz question right. Click 1 winning picture. Type 2, 2 and 2 as the attempts.", "Click Calculate. MY bands give Weak. YOURS give YOUR lowest group.", "Look at the code on screens 2-3 and 2-4.", "#cw/10/2-3"),
     tryit("4-1.t4", "After the group appears, click Calculate again.", "Nothing must happen, because the panel is grey.", "If something happens, look at the code on screen 3-8.", "#cw/10/3-8", neg=True)]}
   ]}]}
 ]}
