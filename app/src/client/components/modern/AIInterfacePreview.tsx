import { Wine, Sparkles, Mic, Settings, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';

export default function AIInterfacePreview() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-bordeaux-100 overflow-hidden">
      {/* Preview Header - Browser-like */}
      <div className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="text-white text-sm font-medium">WineClub AI Sommelier</div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* AI Interface Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - AI Controls */}
          <div className="space-y-4">
            {/* AI Status Bar */}
            <div className="flex items-center space-x-3 p-3 bg-bordeaux-50 rounded-lg border border-bordeaux-100">
              <div className="w-8 h-8 bg-bordeaux-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-bordeaux-900">AI Sommelier Active</div>
                <div className="text-xs text-bordeaux-600">Listening for wine questions</div>
              </div>
              <div className="text-xs text-bordeaux-500">00:00</div>
            </div>

            {/* Microphone Status */}
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-green-900">Microphone Active</div>
                <div className="text-xs text-green-600">Ready to hear your questions</div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input 
                  type="text" 
                  placeholder="Ask about wine pairing, recommendations, or tasting notes..." 
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700"
                  disabled
                />
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">⌘K</div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Show/Hide AI Assistant</span>
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">⌘H</div>
                <div className="ml-auto">
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">AI Settings</span>
                <div className="ml-auto">
                  <Settings className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - AI Response */}
          <div className="bg-gradient-to-br from-bordeaux-50 to-champagne-50 p-4 rounded-lg border border-bordeaux-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-bordeaux-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Wine className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-bordeaux-900 mb-2">AI Sommelier Response</div>
                <div className="text-sm text-bordeaux-700 leading-relaxed mb-4">
                  "I can see you're looking for a wine to pair with your dinner. Based on your taste preferences and the meal you're planning, 
                  I recommend a 2019 Château Margaux Bordeaux blend that would complement your dish perfectly. 
                  This wine has notes of blackberry, cedar, and subtle oak that will enhance your dining experience."
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-lg p-3 border border-bordeaux-100">
                    <div className="text-xs font-medium text-bordeaux-900 mb-1">Wine Recommendation</div>
                    <div className="text-sm text-bordeaux-700">Château Margaux 2019 - €450</div>
                    <div className="text-xs text-bordeaux-600 mt-1">Bordeaux, France • 95 points</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-bordeaux-600 hover:bg-bordeaux-700 text-white text-xs">
                      Add to Cart
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-bordeaux-200 text-bordeaux-700">
                      Learn More
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-bordeaux-200 text-bordeaux-700">
                      Similar Wines
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 pt-4 border-t border-bordeaux-100">
          <div className="flex items-center justify-between text-xs text-bordeaux-600">
            <div className="flex items-center space-x-4">
              <span>AI Status: Active</span>
              <span>•</span>
              <span>Listening for voice input</span>
              <span>•</span>
              <span>Context: Dinner pairing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 