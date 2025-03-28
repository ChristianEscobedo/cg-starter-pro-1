'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Minus, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'

type PollOption = {
  id: string
  text: string
  votes: number
}

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

type InteractivePollProps = {
  question: string
  options: PollOption[]
  onVote?: (optionId: string) => void
  isPreview?: boolean
}

type InteractiveQuizProps = {
  title: string
  questions: QuizQuestion[]
  onSubmit?: (answers: number[]) => void
  isPreview?: boolean
}

type SwipeUpProps = {
  text: string
  linkText: string
  url: string
  isPreview?: boolean
}

export function InteractivePoll({
  question = "What's your favorite feature?",
  options = [
    { id: '1', text: 'Option 1', votes: 25 },
    { id: '2', text: 'Option 2', votes: 42 },
    { id: '3', text: 'Option 3', votes: 18 },
  ],
  onVote,
  isPreview = false,
}: InteractivePollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = () => {
    if (!selectedOption || hasVoted) return

    if (onVote) {
      onVote(selectedOption)
    }

    setHasVoted(true)
  }

  return (
    <Card className="w-full overflow-hidden border border-gray-200 bg-white shadow-sm">
      <CardHeader className="bg-blue-50 pb-2 pt-3">
        <CardTitle className="text-center text-sm font-medium text-blue-700">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {!hasVoted ? (
                      <RadioGroup value={selectedOption || ''} onValueChange={setSelectedOption}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                          <Label htmlFor={`option-${option.id}`} className="cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <span className="text-sm">{option.text}</span>
                    )}
                  </div>
                  {hasVoted && <span className="text-sm font-medium">{percentage}%</span>}
                </div>

                {hasVoted && (
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )
          })}

          {!hasVoted && (
            <Button
              onClick={handleVote}
              disabled={!selectedOption || isPreview}
              className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Vote Now
            </Button>
          )}

          {hasVoted && <p className="mt-2 text-center text-xs text-gray-500">{totalVotes} votes</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function InteractiveQuiz({
  title = 'Test Your Knowledge!',
  questions = [
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
    },
    {
      id: '2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
    },
  ],
  onSubmit,
  isPreview = false,
}: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = index
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      if (onSubmit) {
        onSubmit(answers)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score
    }, 0)
  }

  return (
    <Card className="w-full overflow-hidden border border-gray-200 bg-white shadow-sm">
      <CardHeader className="bg-purple-50 pb-2 pt-3">
        <CardTitle className="text-center text-sm font-medium text-purple-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!showResults ? (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
            </div>

            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h3 className="text-sm font-medium">{questions[currentQuestion].question}</h3>

            <RadioGroup
              value={answers[currentQuestion].toString()}
              onValueChange={(value) => handleAnswer(parseInt(value))}
            >
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`q${currentQuestion}-option-${index}`}
                    />
                    <Label
                      htmlFor={`q${currentQuestion}-option-${index}`}
                      className="cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentQuestion === 0 || isPreview}
              >
                Previous
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                disabled={answers[currentQuestion] === -1 || isPreview}
                className="bg-purple-500 text-white hover:bg-purple-600"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                {currentQuestion !== questions.length - 1 && (
                  <ChevronRight className="ml-1 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-medium">Quiz Results</h3>
            <div className="rounded-full bg-purple-100 p-6">
              <p className="text-3xl font-bold text-purple-700">
                {calculateScore()} / {questions.length}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              You got {calculateScore()} out of {questions.length} questions correct!
            </p>
            <Button
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers(new Array(questions.length).fill(-1))
                setShowResults(false)
              }}
              className="w-full bg-purple-500 text-white hover:bg-purple-600"
              disabled={isPreview}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SwipeUpComponent({
  text = 'Check out our latest products!',
  linkText = 'Shop Now',
  url = 'https://example.com',
  isPreview = false,
}: SwipeUpProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
      <div className="space-y-4 text-center">
        <p className="text-lg font-medium">{text}</p>

        <div className="animate-bounce">
          <ChevronUp className="mx-auto h-6 w-6" />
        </div>

        <Button
          variant="outline"
          className="w-full border-white bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
          disabled={isPreview}
          onClick={() => {
            if (!isPreview) {
              window.open(url, '_blank')
            }
          }}
        >
          {linkText}
        </Button>
      </div>
    </div>
  )
}

export function InteractiveElementsGenerator() {
  const [elementType, setElementType] = useState<'poll' | 'quiz' | 'swipe-up'>('poll')

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("What's your favorite feature?")
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: 'Option 1', votes: 25 },
    { id: '2', text: 'Option 2', votes: 42 },
  ])

  // Quiz state
  const [quizTitle, setQuizTitle] = useState('Test Your Knowledge!')
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
    },
  ])

  // Swipe-up state
  const [swipeUpText, setSwipeUpText] = useState('Check out our latest products!')
  const [swipeUpLinkText, setSwipeUpLinkText] = useState('Shop Now')
  const [swipeUpUrl, setSwipeUpUrl] = useState('https://example.com')

  // Poll functions
  const addPollOption = () => {
    setPollOptions([
      ...pollOptions,
      { id: Date.now().toString(), text: `Option ${pollOptions.length + 1}`, votes: 0 },
    ])
  }

  const removePollOption = (id: string) => {
    if (pollOptions.length <= 2) return
    setPollOptions(pollOptions.filter((option) => option.id !== id))
  }

  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  // Quiz functions
  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: Date.now().toString(),
        question: `Question ${quizQuestions.length + 1}`,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0,
      },
    ])
  }

  const removeQuizQuestion = (id: string) => {
    if (quizQuestions.length <= 1) return
    setQuizQuestions(quizQuestions.filter((question) => question.id !== id))
  }

  const updateQuizQuestion = (id: string, field: string, value: any) => {
    setQuizQuestions(
      quizQuestions.map((question) =>
        question.id === id ? { ...question, [field]: value } : question
      )
    )
  }

  const updateQuizOption = (questionId: string, index: number, value: string) => {
    setQuizQuestions(
      quizQuestions.map((question) => {
        if (question.id === questionId) {
          const newOptions = [...question.options]
          newOptions[index] = value
          return { ...question, options: newOptions }
        }
        return question
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <Button
          variant={elementType === 'poll' ? 'default' : 'outline'}
          onClick={() => setElementType('poll')}
          className="flex-1"
        >
          Poll
        </Button>
        <Button
          variant={elementType === 'quiz' ? 'default' : 'outline'}
          onClick={() => setElementType('quiz')}
          className="flex-1"
        >
          Quiz
        </Button>
        <Button
          variant={elementType === 'swipe-up' ? 'default' : 'outline'}
          onClick={() => setElementType('swipe-up')}
          className="flex-1"
        >
          Swipe Up
        </Button>
      </div>

      <div className="rounded-lg border p-4">
        {elementType === 'poll' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poll-question">Poll Question</Label>
              <Input
                id="poll-question"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-2">
              <Label>Poll Options</Label>
              {pollOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    value={option.text}
                    onChange={(e) => updatePollOption(option.id, e.target.value)}
                    placeholder="Option text"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removePollOption(option.id)}
                    disabled={pollOptions.length <= 2}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addPollOption} className="mt-2 w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-medium">Preview</h3>
              <InteractivePoll question={pollQuestion} options={pollOptions} isPreview={true} />
            </div>
          </div>
        )}

        {elementType === 'quiz' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>

            <div className="space-y-4">
              <Label>Questions</Label>
              {quizQuestions.map((question, qIndex) => (
                <div key={question.id} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-medium">Question {qIndex + 1}</h4>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuizQuestion(question.id)}
                      disabled={quizQuestions.length <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                      <Input
                        id={`question-${question.id}`}
                        value={question.question}
                        onChange={(e) =>
                          updateQuizQuestion(question.id, 'question', e.target.value)
                        }
                        placeholder="Enter question"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Options</Label>
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroup
                            value={question.correctAnswer.toString()}
                            onValueChange={(value) =>
                              updateQuizQuestion(question.id, 'correctAnswer', parseInt(value))
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={index.toString()}
                                id={`correct-${question.id}-${index}`}
                              />
                            </div>
                          </RadioGroup>
                          <Input
                            value={option}
                            onChange={(e) => updateQuizOption(question.id, index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addQuizQuestion} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>

            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-medium">Preview</h3>
              <InteractiveQuiz title={quizTitle} questions={quizQuestions} isPreview={true} />
            </div>
          </div>
        )}

        {elementType === 'swipe-up' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="swipe-text">Swipe Up Text</Label>
              <Textarea
                id="swipe-text"
                value={swipeUpText}
                onChange={(e) => setSwipeUpText(e.target.value)}
                placeholder="Enter text to display"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                value={swipeUpLinkText}
                onChange={(e) => setSwipeUpLinkText(e.target.value)}
                placeholder="Enter button text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                value={swipeUpUrl}
                onChange={(e) => setSwipeUpUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </div>

            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-medium">Preview</h3>
              <SwipeUpComponent
                text={swipeUpText}
                linkText={swipeUpLinkText}
                url={swipeUpUrl}
                isPreview={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
