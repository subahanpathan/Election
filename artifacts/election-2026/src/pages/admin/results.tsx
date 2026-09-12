import { useGetResults, useGetResultsSummary } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminResults() {
  const { data: results, isLoading: resultsLoading } = useGetResults();
  const { data: summary, isLoading: summaryLoading } = useGetResultsSummary();
  const { toast } = useToast();

  if (resultsLoading || summaryLoading) return <LoadingScreen />;
  if (!results || !summary) return null;

  const handleExport = () => {
    toast({
      title: "Export Initiated",
      description: "Generating CSV report. This feature is simulated.",
    });
  };

  const renderCandidateTable = (candidates: any[], title: string) => (
    <Card className="glass-card border-white/10 bg-black/20 mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-heading">{title} Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Votes</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...candidates].sort((a, b) => b.voteCount - a.voteCount).map((result, idx) => (
              <TableRow key={result.candidate.id} className={`border-white/5 ${idx === 0 ? 'bg-primary/5' : ''}`}>
                <TableCell>
                  {idx === 0 ? (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <span className="text-muted-foreground">{idx + 1}</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {result.candidate.name}
                  {idx === 0 && results.isFinalized && <span className="ml-2 text-xs text-emerald-500 font-bold tracking-wider">WINNER</span>}
                </TableCell>
                <TableCell className="text-muted-foreground">{result.candidate.className}</TableCell>
                <TableCell className="text-right font-bold">{result.voteCount}</TableCell>
                <TableCell className="text-right">{result.percentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Detailed Results</h1>
          <p className="text-muted-foreground mt-1">Full breakdown of the election outcome.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 rounded-xl">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Votes</p>
          <p className="text-2xl font-bold font-heading">{results.totalVotes}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Students</p>
          <p className="text-2xl font-bold font-heading">{summary.totalStudents}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-1">Turnout</p>
          <p className="text-2xl font-bold font-heading text-primary">{summary.turnoutPercentage.toFixed(1)}%</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-1">Status</p>
          <p className={`text-xl font-bold font-heading mt-1 ${results.isFinalized ? 'text-emerald-500' : 'text-yellow-500'}`}>
            {results.isFinalized ? 'Finalized' : 'Ongoing'}
          </p>
        </div>
      </div>

      {renderCandidateTable(results.headBoy, "Head Boy")}
      {renderCandidateTable(results.headGirl, "Head Girl")}
    </div>
  );
}
