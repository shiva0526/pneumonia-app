import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getHistory as fetchServerHistory } from "@/api/scanApi";
import apiClient from "@/api/apiClient";

interface HistoryItem {
  prediction: string;
  confidence: number;
  date: string;
  thumbnail: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      // If user is logged in, fetch their history from the server
      if (isAuthenticated) {
        try {
          const serverScans = await fetchServerHistory();
          // Map server scan shape to the local HistoryItem shape
          const mapped = serverScans.map((s: any) => ({
            prediction: s.prediction,
            confidence: s.confidence,
            date: s.created_at,
            thumbnail: `${apiClient.defaults.baseURL}/uploads/scans/${s.image_path}`,
          }));
          setHistory(mapped);
          return;
        } catch (err) {
          // fallback to localStorage if server call fails
          console.error("Failed to fetch server history:", err);
        }
      }

      const stored = localStorage.getItem('scanHistory');
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse local scanHistory:', e);
          setHistory([]);
        }
      }
    };

    load();
  }, [isAuthenticated]);

  const clearHistory = () => {
    if (isAuthenticated) {
      // Server-side deletion endpoint not implemented; only clear local cache.
      // You may want to implement a backend endpoint to delete user scans.
      localStorage.removeItem('scanHistory');
      setHistory([]);
      toast({
        title: "History Cleared (local)",
        description: "Local history cleared. To remove server-side scans implement a deletion endpoint.",
      });
      return;
    }

    localStorage.removeItem('scanHistory');
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All scan history has been removed",
    });
  };

  const getIcon = (prediction: string) => {
    const predLower = prediction.toLowerCase();
    if (predLower.includes('normal')) return CheckCircle;
    if (predLower.includes('viral')) return AlertTriangle;
    return XCircle;
  };

  const getColor = (prediction: string) => {
    const predLower = prediction.toLowerCase();
    if (predLower.includes('normal')) return 'text-success';
    if (predLower.includes('viral')) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Scan History</h1>
            <p className="text-muted-foreground">
              {history.length} scan{history.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          {history.length > 0 && (
            <Button 
              onClick={clearHistory}
              variant="outline"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Scans Yet</h3>
            <p className="text-muted-foreground">
              Upload and analyze X-rays to see your history here
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => {
              const Icon = getIcon(item.prediction);
              const colorClass = getColor(item.prediction);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt="X-ray thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                        <span className="font-semibold">{item.prediction}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default History;
